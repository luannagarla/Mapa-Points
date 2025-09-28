import { useRef, useEffect, useState, useCallback } from 'react'
import { AlertCircle } from 'lucide-react'

const MapComponent = ({ points, onMapReady }) => {
  const mapRef = useRef(null)
  const [mapError, setMapError] = useState(false)
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'

  // =============================
  // SIMULATED MAP (fallback)
  // =============================
  const SimulatedMap = () => {
    const canvasRef = useRef(null)
    const [zoom, setZoom] = useState(1)
    const [center, setCenter] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
    const [worldGeoJSON, setWorldGeoJSON] = useState(null)

    // carregar mapa mundi simplificado (geojson leve)
    useEffect(() => {
      fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(res => res.json())
        .then(topology => {
          // converte topojson → geojson
          import("topojson-client").then(topojson => {
            const geo = topojson.feature(topology, topology.objects.countries)
            setWorldGeoJSON(geo)
          })
        })
        .catch(err => console.error("Erro ao carregar mapa:", err))
    }, [])

    // --------------------------
    // ZOOM NATURAL
    // --------------------------
    const handleZoom = (scale, mouseX, mouseY) => {
      if (!canvasRef.current) return
      setZoom(prevZoom => {
        const newZoom = Math.min(Math.max(prevZoom * scale, 0.5), 20)
        const rect = canvasRef.current.getBoundingClientRect()
        const x = mouseX - rect.left - canvasRef.current.width / 2
        const y = mouseY - rect.top - canvasRef.current.height / 2
        setCenter(prev => ({
          x: prev.x - x * (scale - 1),
          y: prev.y - y * (scale - 1)
        }))
        return newZoom
      })
    }

    const handleWheel = (e) => {
      e.preventDefault()
      const scale = e.deltaY < 0 ? 1.2 : 0.8
      handleZoom(scale, e.clientX, e.clientY)
    }

    // --------------------------
    // ARRASTAR
    // --------------------------
    const handleMouseDown = (e) => {
      setIsDragging(true)
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
    const handleMouseMove = (e) => {
      if (!isDragging) return
      const deltaX = e.clientX - lastMousePos.x
      const deltaY = e.clientY - lastMousePos.y
      setCenter(prev => ({ x: prev.x + deltaX / zoom, y: prev.y + deltaY / zoom }))
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
    const handleMouseUp = () => setIsDragging(false)

    // --------------------------
    // SCREENSHOT
    // --------------------------
    const handleScreenshot = () => {
      if (!canvasRef.current) return
      const url = canvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = url
      link.download = "mapa-screenshot.png"
      link.click()
    }

    // --------------------------
    // DRAW
    // --------------------------
    const drawMap = useCallback(() => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(canvas.width / 2 + center.x, canvas.height / 2 + center.y)
      ctx.scale(zoom, zoom)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      // fundo oceano
      ctx.fillStyle = '#b3d9ff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // desenha países do geojson
      if (worldGeoJSON) {
        worldGeoJSON.features.forEach(feature => {
          const drawPolygon = (polygon) => {
            ctx.beginPath()
            polygon.forEach((coords, index) => {
              const [lng, lat] = coords
              const x = ((lng + 180) / 360) * canvas.width
              const y = ((90 - lat) / 180) * canvas.height
              if (index === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            })
            ctx.closePath()
            ctx.fillStyle = '#d4e2c4' // terra
            ctx.fill()
            ctx.strokeStyle = '#666'
            ctx.lineWidth = 0.5 / zoom
            ctx.stroke()
          }

          if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates.forEach(drawPolygon)
          } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(multiPolygon => {
              multiPolygon.forEach(drawPolygon)
            })
          }
        })
      }

      // pontos
      points.forEach((p, i) => {
        const x = ((p.lng + 180) / 360) * canvas.width
        const y = ((90 - p.lat) / 180) * canvas.height

        ctx.beginPath()
        ctx.arc(x, y, 8 / zoom, 0, 2 * Math.PI)
        ctx.fillStyle = '#4F46E5'
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2 / zoom
        ctx.stroke()

        ctx.fillStyle = '#fff'
        ctx.font = `${10 / zoom}px Arial`
        ctx.textAlign = 'center'
        ctx.fillText(`${i + 1}`, x, y + 3 / zoom)
      })

      // trajetória
      if (points.length > 1) {
        ctx.strokeStyle = '#FF0000'
        ctx.lineWidth = 3 / zoom
        ctx.beginPath()
        points.forEach((p, i) => {
          const x = ((p.lng + 180) / 360) * canvas.width
          const y = ((90 - p.lat) / 180) * canvas.height
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()
      }

      ctx.restore()
    }, [points, zoom, center, worldGeoJSON])

    useEffect(() => {
      drawMap()
    }, [drawMap])

    return (
      <div className="relative w-full h-[520px] bg-blue-50 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={520}
          className="w-full h-full"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />

        {/* Controles */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => handleZoom(1.2, canvasRef.current.width / 2, canvasRef.current.height / 2)}
            className="w-10 h-10 bg-white rounded shadow"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(0.8, canvasRef.current.width / 2, canvasRef.current.height / 2)}
            className="w-10 h-10 bg-white rounded shadow"
          >
            −
          </button>
          <button
            onClick={handleScreenshot}
            className="w-10 h-10 bg-white rounded shadow text-xs"
            title="Exportar Screenshot"
          >
            📷
          </button>
        </div>

        {/* aviso */}
        <div className="absolute top-4 left-4 bg-white/90 rounded p-2 text-xs flex gap-2 shadow">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>Modo simulado. Configure uma chave do Google Maps.</span>
        </div>
      </div>
    )
  }

  // =============================
  // GOOGLE MAPS
  // =============================
  useEffect(() => {
    if (API_KEY === 'YOUR_API_KEY') {
      setMapError(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=geometry`
    script.async = true
    script.defer = true
    script.onload = () => initGoogleMap()
    script.onerror = () => setMapError(true)
    document.head.appendChild(script)

    const initGoogleMap = () => {
      if (!mapRef.current || !window.google) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -23.55, lng: -46.63 },
        zoom: 10,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      })

      // markers
      const bounds = new window.google.maps.LatLngBounds()
      points.forEach((p, i) => {
        const pos = { lat: p.lat, lng: p.lng }
        const marker = new google.maps.Marker({
          position: pos,
          map,
          label: `${i + 1}`,
        })
        const info = new google.maps.InfoWindow({
          content: `<strong>${p.name}</strong>`,
        })
        marker.addListener('click', () => info.open(map, marker))
        bounds.extend(pos)
      })

      if (points.length > 0) map.fitBounds(bounds)

      // polyline
      if (points.length > 1) {
        new google.maps.Polyline({
          path: points.map(p => ({ lat: p.lat, lng: p.lng })),
          map,
          strokeColor: '#FF0000',
          strokeWeight: 3,
        })
      }

      onMapReady?.(map)
    }
  }, [API_KEY, points])

  if (mapError) return <SimulatedMap />

  return (
    <div className="relative w-full h-[520px] rounded-lg">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  )
}

export default MapComponent
