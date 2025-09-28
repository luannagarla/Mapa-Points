# Sistema de Trajetórias em Mapas

Um sistema web moderno e elegante desenvolvido em React que permite adicionar pontos no mapa, criar trajetórias e exportar dados em formato GeoJSON. O sistema funciona tanto com a API do Google Maps quanto em modo de demonstração simulado.

## 🚀 Características

- **Interface Moderna**: Design elegante com Tailwind CSS e componentes shadcn/ui
- **Mapas Interativos**: Integração com Google Maps API ou modo simulado
- **Pontos Personalizados**: Adicione pontos com nomes e coordenadas
- **Trajetórias**: Desenhe linhas conectando os pontos adicionados
- **Exportação GeoJSON**: Baixe dados em formato GeoJSON padrão
- **Captura de Mapa**: Baixe imagens PNG do mapa em alta qualidade
- **Relatórios**: Gere relatórios detalhados com informações dos pontos
- **Responsivo**: Interface adaptável para diferentes tamanhos de tela

## 🛠️ Tecnologias Utilizadas

- **React 19**: Framework JavaScript moderno
- **Vite**: Build tool rápido e eficiente
- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes UI elegantes
- **Lucide React**: Ícones modernos
- **html2canvas**: Captura de screenshots
- **Google Maps API**: Mapas interativos (opcional)

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

## 📁 Estrutura do Projeto

```
maps-trajectory-system/
├── public/                 # Arquivos públicos (inclui countries.geojson)
├── src/
│   ├── components/
│   │   ├── ui/            # Componentes shadcn/ui
│   │   └── MapComponent.jsx # Componente do mapa
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos principais
│   └── main.jsx           # Ponto de entrada
├── package.json           # Dependências
├── .env.example          # Exemplo de arquivo de ambiente
└── README.md             # Este arquivo
```

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

## 🎨 Personalização

### Estilos do Mapa

Edite as configurações de estilo no `MapComponent.jsx`:

```javascript
styles: [
  {
    featureType: 'all',
    elementType: 'geometry.fill',
    stylers: [{ weight: '2.00' }]
  }
  // Adicione mais estilos aqui
]
```

### Cores da Trajetória

Modifique a cor da linha no `App.jsx`:

```javascript
strokeColor: '#FF0000', // Vermelho
strokeOpacity: 1.0,
strokeWeight: 3
```

## 🚀 Deploy (Hospedagem)

Para hospedar sua aplicação React, você precisará primeiro criar uma build de produção e depois fazer o deploy dos arquivos estáticos gerados para um serviço de hospedagem.

### 1. Build de Produção

No diretório raiz do projeto, execute o comando:

```bash
pnpm run build
```

Este comando criará uma pasta `dist/` (ou `build/`, dependendo da configuração do Vite) contendo todos os arquivos estáticos otimizados para produção (HTML, CSS, JavaScript, imagens, etc.).

### 2. Escolha um Serviço de Hospedagem

Você pode hospedar esta aplicação em diversos serviços de hospedagem de sites estáticos. Alguns dos mais populares e fáceis de usar incluem:

#### a) Vercel

1.  **Crie uma conta** no [Vercel](https://vercel.com/).
2.  **Conecte seu repositório Git** (GitHub, GitLab, Bitbucket) ao Vercel.
3.  **Importe seu projeto**. O Vercel detectará automaticamente que é um projeto Vite/React e configurará o build.
4.  **Configure as variáveis de ambiente** (se estiver usando a API do Google Maps):
    -   Vá para as configurações do seu projeto no Vercel.
    -   Adicione `VITE_GOOGLE_MAPS_API_KEY` com o valor da sua chave da API.
5.  **Faça o deploy**. O Vercel fará o build e o deploy automaticamente a cada push para o seu repositório.

#### b) Netlify

1.  **Crie uma conta** no [Netlify](https://www.netlify.com/).
2.  **Conecte seu repositório Git** (GitHub, GitLab, Bitbucket) ao Netlify.
3.  **Importe seu projeto**. O Netlify detectará que é um projeto React e configurará o build.
4.  **Configure as variáveis de ambiente** (se estiver usando a API do Google Maps):
    -   Vá para as configurações do seu site no Netlify.
    -   Em "Build & deploy" > "Environment", adicione `VITE_GOOGLE_MAPS_API_KEY` com o valor da sua chave da API.
5.  **Faça o deploy**. O Netlify fará o build e o deploy automaticamente a cada push para o seu repositório.

#### c) GitHub Pages

1.  **Crie um repositório Git** para o seu projeto no GitHub.
2.  **Instale o `gh-pages`** para facilitar o deploy:
    ```bash
    pnpm add -D gh-pages
    ```
3.  **Adicione scripts ao `package.json`**:
    ```json
    "scripts": {
      "predeploy": "pnpm run build",
      "deploy": "gh-pages -d dist",
      // ... outros scripts
    },
    "homepage": "https://<SEU_USUARIO>.github.io/<SEU_REPOSITORIO>"
    ```
    Substitua `<SEU_USUARIO>` e `<SEU_REPOSITORIO>` pelos seus dados.
4.  **Configure o `base` no `vite.config.js`** (se ainda não o fez):
    ```javascript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    export default defineConfig({
      plugins: [react()],
      base: '/<SEU_REPOSITORIO>/', // Importante para GitHub Pages
    })
    ```
5.  **Faça o deploy**:
    ```bash
    pnpm run deploy
    ```
6.  **Ative o GitHub Pages** nas configurações do seu repositório no GitHub, selecionando a branch `gh-pages` como fonte.

### 3. Configuração de Variáveis de Ambiente (Chave da API do Google Maps)

Para que o mapa real do Google Maps funcione em produção, você **DEVE** configurar a variável de ambiente `VITE_GOOGLE_MAPS_API_KEY` no seu serviço de hospedagem (Vercel, Netlify, etc.) com a sua chave da API do Google Maps. Caso contrário, o sistema continuará a usar o mapa simulado.

## 🔍 Solução de Problemas

### Mapa não carrega
- Verifique se a chave da API está correta
- Confirme se a Maps JavaScript API está ativada
- Verifique o console do navegador para erros

### Pontos não aparecem
- Verifique se as coordenadas estão no formato correto
- Latitude: -90 a 90
- Longitude: -180 a 180

### Download não funciona
- Verifique se o navegador permite downloads
- Alguns navegadores bloqueiam downloads automáticos

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação da API do Google Maps
- Verifique os logs do console do navegador

## 🎯 Roadmap

- [ ] Importação de arquivos GeoJSON
- [ ] Edição de pontos existentes
- [ ] Múltiplas trajetórias
- [ ] Cálculo de distâncias reais
- [ ] Integração com outras APIs de mapas
- [ ] Modo offline
- [ ] Compartilhamento de mapas

---

Desenvolvido com ❤️ usando React e Google Maps API

