import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { MapPin, Download, Plus, Trash2, Route, FileText, Map, Camera } from 'lucide-react'
import html2canvas from 'html2canvas'
import MapComponent from './components/MapComponent'
import './App.css'

function App() {
  const [points, setPoints] = useState([])
  const [newPointName, setNewPointName] = useState('')
  const [newPointLat, setNewPointLat] = useState('')
  const [newPointLng, setNewPointLng] = useState('')
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [polylines, setPolylines] = useState([])
  const [isCapturing, setIsCapturing] = useState(false)
  const mapContainerRef = useRef(null)

  // Função chamada quando o mapa está pronto
  const handleMapReady = (mapInstance) => {
    setMap(mapInstance)
  }

  // Função para adicionar um novo ponto
  const addPoint = () => {
    if (!newPointName || !newPointLat || !newPointLng) {
      alert('Por favor, preencha todos os campos do ponto.')
      return
    }

    const lat = parseFloat(newPointLat)
    const lng = parseFloat(newPointLng)

    if (isNaN(lat) || isNaN(lng)) {
      alert('Por favor, insira coordenadas válidas.')
      return
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Por favor, insira coordenadas válidas (Lat: -90 a 90, Lng: -180 a 180).')
      return
    }

    const newPoint = {
      id: Date.now(),
      name: newPointName,
      lat: lat,
      lng: lng
    }

    const updatedPoints = [...points, newPoint]
    setPoints(updatedPoints)
    setNewPointName('')
    setNewPointLat('')
    setNewPointLng('')

    // Adicionar marcador no mapa do Google Maps (se disponível)
    if (map && window.google) {
      const marker = new window.google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: newPointName,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4F46E5',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        }
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div class="p-2"><strong>${newPointName}</strong><br/>Lat: ${lat}<br/>Lng: ${lng}</div>`
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      setMarkers([...markers, marker])
    }
  }

  // Função para remover um ponto
  const removePoint = (pointId) => {
    const pointIndex = points.findIndex(point => point.id === pointId)
    if (pointIndex !== -1 && markers[pointIndex]) {
      markers[pointIndex].setMap(null)
      setMarkers(markers.filter((_, index) => index !== pointIndex))
    }
    setPoints(points.filter(point => point.id !== pointId))
  }

  // Função para desenhar trajetória
  const drawTrajectory = () => {
    if (points.length < 2) {
      alert('Adicione pelo menos 2 pontos para criar uma trajetória.')
      return
    }

    // Limpar trajetórias anteriores
    polylines.forEach(polyline => {
      if (polyline.setMap) polyline.setMap(null)
    })

    if (map && window.google) {
      const path = points.map(point => ({ lat: point.lat, lng: point.lng }))

      const polyline = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
      })

      polyline.setMap(map)
      setPolylines([polyline])

      // Ajustar o zoom para mostrar todos os pontos
      const bounds = new window.google.maps.LatLngBounds()
      points.forEach(point => {
        bounds.extend(new window.google.maps.LatLng(point.lat, point.lng))
      })
      map.fitBounds(bounds)
    }
  }

  // Função para gerar GeoJSON
  const generateGeoJSON = () => {
    if (points.length === 0) {
      alert('Adicione pelo menos um ponto para gerar GeoJSON.')
      return
    }

    const features = []

    // Adicionar pontos como features
    points.forEach((point, index) => {
      features.push({
        type: 'Feature',
        properties: {
          name: point.name,
          description: `Ponto ${index + 1}: ${point.name}`,
          marker: index + 1
        },
        geometry: {
          type: 'Point',
          coordinates: [point.lng, point.lat]
        }
      })
    })

    // Adicionar trajetória como LineString se houver mais de um ponto
    if (points.length > 1) {
      features.push({
        type: 'Feature',
        properties: {
          name: 'Trajetória',
          description: `Trajetória conectando ${points.length} pontos`,
          stroke: '#FF0000',
          'stroke-width': 3,
          'stroke-opacity': 1
        },
        geometry: {
          type: 'LineString',
          coordinates: points.map(point => [point.lng, point.lat])
        }
      })
    }

    const geoJSON = {
      type: 'FeatureCollection',
      features: features
    }

    return geoJSON
  }

  // Função para baixar GeoJSON
  const downloadGeoJSON = () => {
    const geoJSON = generateGeoJSON()
    const dataStr = JSON.stringify(geoJSON, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'trajetoria.geojson'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Função para baixar informações dos pontos
  const downloadPointsInfo = () => {
    if (points.length === 0) {
      alert('Adicione pelo menos um ponto para baixar as informações.')
      return
    }

    let content = 'SISTEMA DE TRAJETÓRIAS EM MAPAS\n'
    content += '================================\n\n'
    content += `Total de pontos: ${points.length}\n`
    content += `Data de geração: ${new Date().toLocaleString('pt-BR')}\n\n`
    
    content += 'PONTOS DA TRAJETÓRIA:\n'
    content += '--------------------\n'
    
    points.forEach((point, index) => {
      content += `${index + 1}. ${point.name}\n`
      content += `   Latitude: ${point.lat}\n`
      content += `   Longitude: ${point.lng}\n\n`
    })

    if (points.length > 1) {
      // Calcular distância total aproximada
      let totalDistance = 0
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng)
        totalDistance += distance
      }
      
      content += `INFORMAÇÕES DA TRAJETÓRIA:\n`
      content += `-------------------------\n`
      content += `Distância total aproximada: ${totalDistance.toFixed(2)} km\n`
      content += `Número de segmentos: ${points.length - 1}\n\n`
    }

    content += 'FORMATO GEOJSON:\n'
    content += '---------------\n'
    content += JSON.stringify(generateGeoJSON(), null, 2)

    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(content)
    const exportFileDefaultName = 'informacoes_trajetoria.txt'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Função para capturar screenshot do mapa
  const captureMapScreenshot = async () => {
    if (points.length === 0) {
      alert('Adicione pelo menos um ponto antes de capturar o mapa.')
      return
    }

    setIsCapturing(true)

    try {
      // Encontrar o canvas do mapa simulado
      const canvasElement = document.querySelector('[data-testid="map-container"] canvas') || 
                           document.querySelector('.map-container canvas') ||
                           mapContainerRef.current?.querySelector('canvas')

      if (!canvasElement) {
        alert('Canvas do mapa não encontrado. Certifique-se de que o mapa está carregado.')
        setIsCapturing(false)
        return
      }

      // Usar o canvas diretamente
      const sourceCanvas = canvasElement
      
      // Criar um canvas de alta resolução para melhor qualidade
      const scaleFactor = 2 // Aumentar resolução 2x
      const finalCanvas = document.createElement('canvas')
      const ctx = finalCanvas.getContext('2d')
      
      // Definir tamanho do canvas final (mapa + área de informações) com alta resolução
      const padding = 80 * scaleFactor // Aumentar padding proporcionalmente
      const infoHeight = 240 * scaleFactor // Aumentar área de informações
      finalCanvas.width = (sourceCanvas.width + (padding * 2 / scaleFactor)) * scaleFactor
      finalCanvas.height = (sourceCanvas.height + (infoHeight / scaleFactor) + (padding * 2 / scaleFactor)) * scaleFactor

      // Configurar contexto para alta qualidade
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.textRenderingOptimization = 'optimizeQuality'

      // Fundo branco
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)

      // Desenhar o mapa capturado com escala aumentada
      ctx.drawImage(sourceCanvas, padding / scaleFactor, padding / scaleFactor, 
                   sourceCanvas.width * scaleFactor, sourceCanvas.height * scaleFactor)

      // Adicionar informações sobre os pontos com fontes maiores e melhor qualidade
      ctx.fillStyle = '#000000'
      ctx.font = `bold ${48 * scaleFactor}px Arial, sans-serif`
      ctx.fillText('Sistema de Trajetórias em Mapas', padding / scaleFactor, 
                  (sourceCanvas.height + padding / scaleFactor + 60) * scaleFactor)

      ctx.font = `${36 * scaleFactor}px Arial, sans-serif`
      ctx.fillText(`Total de pontos: ${points.length}`, padding / scaleFactor, 
                  (sourceCanvas.height + padding / scaleFactor + 110) * scaleFactor)
      ctx.fillText(`Data: ${new Date().toLocaleDateString('pt-BR')}`, padding / scaleFactor, 
                  (sourceCanvas.height + padding / scaleFactor + 160) * scaleFactor)

      // Adicionar lista de pontos com melhor formatação
      ctx.font = `${32 * scaleFactor}px Arial, sans-serif`
      const maxPointsToShow = Math.min(4, points.length) // Mostrar até 4 pontos
      for (let i = 0; i < maxPointsToShow; i++) {
        const point = points[i]
        const text = `${i + 1}. ${point.name} (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)})`
        ctx.fillText(text, (padding / scaleFactor + 600) * scaleFactor, 
                    (sourceCanvas.height + padding / scaleFactor + 60 + (i * 50)) * scaleFactor)
      }

      if (points.length > 4) {
        ctx.fillText(`... e mais ${points.length - 4} pontos`, (padding / scaleFactor + 600) * scaleFactor, 
                    (sourceCanvas.height + padding / scaleFactor + 210) * scaleFactor)
      }

      // Adicionar informações adicionais sobre a trajetória
      if (points.length > 1) {
        let totalDistance = 0
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1]
          const curr = points[i]
          const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng)
          totalDistance += distance
        }
        
        ctx.font = `${28 * scaleFactor}px Arial, sans-serif`
        ctx.fillText(`Distância total aproximada: ${totalDistance.toFixed(2)} km`, 
                    padding / scaleFactor, (sourceCanvas.height + padding / scaleFactor + 210) * scaleFactor)
      }

      // Converter para blob e baixar
      console.log("Tentando converter canvas para blob e baixar...")
      finalCanvas.toBlob((blob) => {
        if (!blob) {
          console.error("Erro: Blob é nulo.")
          alert("Erro ao gerar a imagem do mapa. O blob está vazio.")
          setIsCapturing(false)
          return
        }
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `mapa_trajetoria_${new Date().toISOString().split("T")[0]}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        setIsCapturing(false)
      }, "image/png", 1.0)







    } catch (error) {
      console.error('Erro ao capturar screenshot:', error)
      alert('Erro ao capturar o mapa. Tente novamente.')
      setIsCapturing(false)
    }
  }

  // Função para calcular distância entre dois pontos (fórmula de Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Função para adicionar pontos de exemplo
  const addExamplePoints = () => {
    const examplePoints = [
      { name: 'Marco Zero - Recife', lat: -8.0631, lng: -34.8711 },
      { name: 'Cristo Redentor - Rio de Janeiro', lat: -22.9519, lng: -43.2105 },
      { name: 'Mercado Municipal - São Paulo', lat: -23.5431, lng: -46.6291 },
      { name: 'Pelourinho - Salvador', lat: -12.9714, lng: -38.5124 }
    ]

    examplePoints.forEach((point, index) => {
      setTimeout(() => {
        setNewPointName(point.name)
        setNewPointLat(point.lat.toString())
        setNewPointLng(point.lng.toString())
        setTimeout(() => addPoint(), 100)
      }, index * 200)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Trajetórias em Mapas
          </h1>
          <p className="text-lg text-gray-600">
            Adicione pontos, crie trajetórias e exporte dados em formato GeoJSON
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de Controle */}
          <div className="lg:col-span-1 space-y-6">
            {/* Adicionar Ponto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adicionar Ponto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pointName">Nome do Ponto</Label>
                  <Input
                    id="pointName"
                    value={newPointName}
                    onChange={(e) => setNewPointName(e.target.value)}
                    placeholder="Ex: Ponto de Partida"
                  />
                </div>
                <div>
                  <Label htmlFor="pointLat">Latitude</Label>
                  <Input
                    id="pointLat"
                    type="number"
                    step="any"
                    value={newPointLat}
                    onChange={(e) => setNewPointLat(e.target.value)}
                    placeholder="Ex: -23.5505"
                  />
                </div>
                <div>
                  <Label htmlFor="pointLng">Longitude</Label>
                  <Input
                    id="pointLng"
                    type="number"
                    step="any"
                    value={newPointLng}
                    onChange={(e) => setNewPointLng(e.target.value)}
                    placeholder="Ex: -46.6333"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addPoint} className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                  <Button onClick={addExamplePoints} variant="outline" size="sm">
                    Exemplo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Pontos */}
            <Card>
              <CardHeader>
                <CardTitle>Pontos Adicionados ({points.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {points.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum ponto adicionado ainda
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {points.map((point, index) => (
                      <div
                        key={point.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{index + 1}. {point.name}</p>
                          <p className="text-sm text-gray-500">
                            {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePoint(point.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={drawTrajectory}
                  className="w-full"
                  disabled={points.length < 2}
                >
                  <Route className="h-4 w-4 mr-2" />
                  Desenhar Trajetória
                </Button>
                <Button
                  onClick={captureMapScreenshot}
                  variant="outline"
                  className="w-full"
                  disabled={points.length === 0 || isCapturing}
                >
                  {isCapturing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Capturando...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Baixar Mapa (PNG)
                    </>
                  )}
                </Button>
                <Button
                  onClick={downloadGeoJSON}
                  variant="outline"
                  className="w-full"
                  disabled={points.length === 0}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Baixar GeoJSON
                </Button>
                <Button
                  onClick={downloadPointsInfo}
                  variant="outline"
                  className="w-full"
                  disabled={points.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Baixar Informações
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Mapa Interativo</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={mapContainerRef} data-testid="map-container" className="map-container">
                  <MapComponent 
                    points={points}
                    onMapReady={handleMapReady}
                    drawTrajectory={drawTrajectory}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
