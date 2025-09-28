# Sistema de Trajetórias em Mapas

Um sistema web desenvolvido em React que permite adicionar pontos no mapa, criar trajetórias e exportar dados em formato GeoJSON. O sistema funciona tanto com a API do Google Maps quanto em modo de demonstração simulado.

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm (gerenciador de pacotes)
- Chave da API do Google Maps (opcional, para mapas reais)

## 🔧 Instalação

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd maps-trajectory-system
   ```

2. **Instale as dependências**:
   ```bash
   pnpm install
   ```

3. **Configure a API do Google Maps (Opcional)**:
   - Obtenha uma chave da API no [Google Cloud Console](https://console.cloud.google.com/)
   - Ative a Maps JavaScript API
   - Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave:
     ```
     VITE_GOOGLE_MAPS_API_KEY=SUA_CHAVE_DA_API_AQUI
     ```
   - Se não configurar, o sistema usará o mapa simulado.

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   pnpm run dev
   ```

5. **Acesse a aplicação**:
   - Abra http://localhost:5173 no seu navegador

## 🎯 Como Usar

### Adicionando Pontos

1. **Manualmente**:
   - Preencha o nome do ponto
   - Insira a latitude e longitude
   - Clique em "Adicionar"

2. **Pontos de Exemplo**:
   - Clique no botão "Exemplo" para adicionar pontos pré-definidos do Brasil

### Criando Trajetórias

1. Adicione pelo menos 2 pontos
2. Clique em "Desenhar Trajetória"
3. Uma linha vermelha conectará os pontos na ordem adicionada

### Exportando Dados

1. **GeoJSON**: Baixe dados em formato padrão GeoJSON
2. **Informações**: Baixe relatório detalhado em texto
3. **Mapa PNG**: Capture uma imagem do mapa atual

## 🗺️ Configuração da API do Google Maps

### Obter Chave da API

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs & Services" > "Credentials"
4. Clique em "Create Credentials" > "API Key"
5. Restrinja a chave para maior segurança

### Ativar APIs Necessárias

1. Vá para "APIs & Services" > "Library"
2. Procure e ative:
   - Maps JavaScript API
   - Geocoding API (opcional)

### Configurar no Código

Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave:

```
VITE_GOOGLE_MAPS_API_KEY=SUA_CHAVE_DA_API_AQUI
```