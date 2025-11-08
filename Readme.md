# 🗺️ Mapa Colaborativo de Acessibilidade - UPX 4

## 📋 Sobre o Projeto

O **Mapa Colaborativo de Acessibilidade** é uma plataforma completa que permite aos usuários compartilhar informações sobre a acessibilidade de locais públicos, criando um mapa colaborativo que ajuda pessoas com deficiência a navegar pela cidade com mais facilidade e segurança.

### 🎯 Objetivos
- **Democratizar a informação**: Permitir que qualquer pessoa contribua com informações sobre acessibilidade
- **Melhorar a mobilidade**: Facilitar o deslocamento de pessoas com deficiência
- **Criar comunidade**: Conectar pessoas que se preocupam com acessibilidade
- **Promover inclusão**: Tornar a cidade mais acessível para todos

### ✨ Funcionalidades Principais
- 🗺️ **Mapeamento de Locais**: Integração com Google Maps para localização precisa
- 📝 **Sistema de Relatos**: Usuários podem criar relatos sobre acessibilidade de locais
- 🎯 **Campos de Acessibilidade**: Relatos específicos para rampa de acesso, banheiro acessível, estacionamento acessível e acessibilidade visual
- 📊 **Estatísticas de Acessibilidade**: Análise automática de padrões de acessibilidade por local
- 👍 **Sistema de Votação**: Comunidade pode validar e classificar relatos
- 📈 **Estatísticas Gerais**: Análise de dados para entender padrões de acessibilidade
- 📊 **Dashboard de Estatísticas**: Página completa com gráficos interativos (linha, pizza, barras) mostrando:
  - Estatísticas gerais do sistema (usuários, relatórios, locais, votos)
  - Tendências de relatórios ao longo do tempo (dia, semana, mês)
  - Distribuição de relatórios por tipo
  - Características de acessibilidade (rampa, banheiro, estacionamento, visual)
- 👤 **Página de Perfil**: Perfil completo do usuário com:
  - Visualização e edição de informações pessoais
  - Estatísticas pessoais (relatórios criados, votos recebidos)
  - Lista de relatórios do usuário com opção de exclusão
  - Exclusão de conta
- 🔐 **Autenticação Segura**: Sistema de login com JWT e hash de senhas
- 👥 **Gestão de Usuários**: Perfis personalizáveis e controle de acesso

## 🏗️ Arquitetura do Sistema

### Backend (API REST)
- **Node.js + Fastify**: Framework web rápido e eficiente
- **PostgreSQL**: Banco de dados relacional com Drizzle ORM
- **JWT**: Autenticação segura com tokens
- **Google Maps API**: Integração para localização e mapas
- **Vitest**: Framework de testes com cobertura completa

### Frontend (Interface Web)
- **React.js + TypeScript**: Interface dinâmica e reativa
- **Tailwind CSS**: Estilização responsiva e moderna
- **React Router**: Navegação fluida entre páginas
- **Axios**: Comunicação com APIs
- **Google Maps API**: Mapas interativos no frontend
- **Recharts**: Biblioteca de gráficos para visualização de dados estatísticos

## 📁 Estrutura do Projeto

```
UPX 4/
├── Backend/                    # API REST (Node.js + Fastify)
│   ├── src/                   # Código fonte do backend
│   │   ├── database/          # Configuração do banco de dados
│   │   ├── middleware/        # Middlewares (autenticação, etc.)
│   │   ├── services/          # Serviços auxiliares
│   │   └── types/             # Tipos TypeScript
│   ├── routes/                # Rotas da API organizadas por módulos
│   │   ├── auth/              # Autenticação (login, register, logout)
│   │   ├── users/             # Gestão de usuários
│   │   ├── places/            # Gestão de locais
│   │   ├── reports/           # Gestão de relatos
│   │   └── stats/             # Estatísticas do sistema
│   ├── docs/                  # Documentação completa da API
│   ├── drizzle/               # Migrações do banco de dados
│   └── test-cors/             # Testes de CORS
├── frontend/                  # Interface web (React + TypeScript)
│   └── UPX-IV/               # Aplicação React
│       ├── src/
│       │   ├── pages/         # Páginas da aplicação
│       │   │   ├── home.tsx   # Página inicial
│       │   │   ├── map.tsx    # Página do mapa
│       │   │   ├── mapDetails.tsx  # Detalhes do local
│       │   │   ├── profile.tsx     # Perfil do usuário
│       │   │   ├── stats.tsx       # Dashboard de estatísticas
│       │   │   ├── login.tsx       # Login
│       │   │   └── createUser.tsx  # Registro
│       │   ├── components/    # Componentes reutilizáveis
│       │   ├── services/      # Serviços de API
│       │   ├── routes/         # Configuração de rotas
│       │   └── layouts/        # Layouts da aplicação
│       ├── Dockerfile         # Dockerfile para deploy
│       ├── .dockerignore      # Arquivos ignorados no Docker
│       └── package.json
└── README.md                 # Este arquivo
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (v20+)
- **Docker** e **Docker Compose** (para o banco de dados PostgreSQL)
- **Git**
- **Chave da API do Google Maps**

**Nota**: O PostgreSQL é gerenciado via Docker Compose, então não é necessário instalar PostgreSQL localmente.

### 1. Clone o Repositório
```bash
git clone https://github.com/piresvitor/Upx-IV.git
cd Upx-IV
```

### 2. Configuração do Backend

```bash
# Entre na pasta do backend
cd Backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o banco de dados PostgreSQL via Docker Compose
docker-compose up -d

# Aguarde alguns segundos para o banco estar pronto
# Execute as migrações do banco de dados
npm run db:migrate

# (Opcional) Popule o banco com dados de exemplo
npm run db:seed

# Inicie o servidor de desenvolvimento
npm run dev
```

**Nota**: O PostgreSQL é iniciado automaticamente via Docker Compose. Certifique-se de que o Docker está rodando antes de executar `docker-compose up -d`.

### 3. Configuração do Frontend

```bash
# Entre na pasta do frontend
cd frontend/UPX-IV

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env na pasta frontend/UPX-IV com:
# VITE_API_URL=http://localhost:3333
# VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui

# Inicie o servidor de desenvolvimento
npm run dev
```

### 4. Acesse a Aplicação
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3333
- **Documentação da API**: http://localhost:3333/docs

## 🔧 Configuração de Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/mapa-colaborativo
JWT_SECRET=your_jwt_secret_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NODE_ENV=development
PORT=3333
```

### Frontend (.env)
```env
# URL da API Backend
VITE_API_URL=http://localhost:3333

# Chave da API do Google Maps
VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui
```

**Nota**: No Vite, todas as variáveis de ambiente devem começar com `VITE_` para serem expostas ao código do frontend. Essas variáveis podem ser acessadas via `import.meta.env.VITE_NOME_DA_VARIAVEL`.

## 📚 Documentação

### Backend
- **[Documentação Completa da API](./Backend/docs/README.md)**
- **[Configuração do Google Maps](./Backend/docs/GOOGLE_MAPS_SETUP.md)**
- **[Configuração de CORS](./Backend/docs/CORS_SETUP.md)**
- **[Diagramas de Arquitetura](./Backend/docs/COMPONENT_DIAGRAM.md)**

### Frontend
- **[Documentação do Frontend](./frontend/UPX-IV/README.md)**

## 🧪 Testes

### Backend
```bash
# Executar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Testar CORS
npm run test:cors
```

### Frontend
```bash
# Executar testes do frontend
npm test
```

## 📊 Endpoints da API

### Autenticação (`/auth`)
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Fazer login
- `POST /auth/logout` - Fazer logout

### Usuários (`/users`)
- `GET /users/me` - Obter dados do usuário
- `PUT /users/me` - Atualizar dados do usuário
- `DELETE /users/me` - Excluir conta
- `GET /users` - Buscar todos os usuários

### Locais (`/places`)
- `GET /places/search-nearby` - Buscar locais próximos
- `POST /places/check-or-create` - Verificar ou criar local
- `GET /places/:placeId` - Obter detalhes de um local
- `PUT /places/:placeId` - Atualizar um local
- `GET /places` - Buscar todos os locais
- `GET /places/:placeId/accessibility-stats` - Estatísticas de acessibilidade

### Relatos (`/reports`)
- `POST /places/:placeId/reports` - Criar relato
- `GET /places/:placeId/reports` - Buscar relatos de um local
- `GET /reports` - Listar todos os relatos
- `GET /reports/:reportId` - Obter relato específico
- `PUT /reports/:reportId` - Atualizar relato
- `DELETE /reports/:reportId` - Remover relato
- `POST /reports/:reportId/votes` - Votar em relato
- `DELETE /reports/:reportId/votes` - Remover voto

### Estatísticas (`/stats`)
- `GET /stats/general` - Estatísticas gerais (usuários, relatórios, locais, votos)
- `GET /stats/reports/trends` - Tendências de relatos ao longo do tempo
- `GET /stats/reports/by-type` - Relatos agrupados por tipo
- `GET /stats/reports/accessibility-features` - Estatísticas de características de acessibilidade

## 🎯 Campos de Acessibilidade

O sistema inclui campos específicos para avaliar acessibilidade:

- **Rampa de Acesso** (`rampaAcesso`): Verificação de rampas para cadeirantes
- **Banheiro Acessível** (`banheiroAcessivel`): Banheiros adaptados para PCD
- **Estacionamento Acessível** (`estacionamentoAcessivel`): Vagas especiais para PCD
- **Acessibilidade Visual** (`acessibilidadeVisual`): Recursos para deficientes visuais

Esses campos são utilizados nos relatos e também são exibidos em gráficos estatísticos na página de estatísticas do sistema.

## 📱 Páginas do Frontend

### Páginas Públicas
- **Home** (`/`): Página inicial com informações sobre o projeto
- **Login** (`/login`): Página de autenticação
- **Registro** (`/account/register`): Página de cadastro de novos usuários

### Páginas Protegidas (Requerem autenticação)
- **Mapa** (`/map`): Mapa interativo com locais e relatórios de acessibilidade
- **Detalhes do Local** (`/details/:placeId`): Detalhes completos de um local específico
- **Perfil** (`/profile`): Página de perfil do usuário com:
  - Visualização e edição de informações pessoais
  - Estatísticas pessoais (relatórios criados, votos recebidos)
  - Lista de relatórios do usuário com opção de exclusão
  - Exclusão de conta
- **Estatísticas** (`/stats`): Dashboard completo de estatísticas do sistema com:
  - Cards com estatísticas gerais (usuários, relatórios, locais, votos)
  - Gráfico de linha com tendências de relatórios (dia, semana, mês)
  - Gráficos de pizza e barras para características de acessibilidade
  - Gráficos de pizza e barras para relatórios por tipo
  - Tabelas detalhadas com percentuais e quantidades

## 🛠️ Scripts Disponíveis

### Backend
```bash
npm run dev              # Inicia servidor de desenvolvimento
npm run db:generate      # Gera migrações do banco
npm run db:migrate       # Executa migrações
npm run db:studio        # Interface visual do banco
npm run db:seed          # Popula banco com dados de exemplo
npm test                 # Executa testes
npm run test:coverage    # Testes com cobertura
```

### Frontend
```bash
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build
npm test                 # Executa testes
```

### Docker (Frontend)
```bash
# Build da imagem Docker
docker build -t upx-iv-frontend .

# Executar container
docker run -p 80:80 upx-iv-frontend

# Build e execução com docker-compose (se configurado)
docker-compose up --build
```

## 🌐 Desenvolvimento

### CORS Configurado
O backend está configurado com CORS para permitir requisições do frontend durante o desenvolvimento.

### Docker para Banco de Dados
O projeto inclui configuração Docker Compose para o PostgreSQL com persistência de dados. O banco de dados é gerenciado automaticamente via Docker, então não é necessário instalar PostgreSQL localmente.

**Comandos úteis do Docker Compose:**
```bash
# Iniciar o banco de dados
docker-compose up -d

# Parar o banco de dados
docker-compose down

# Ver logs do banco de dados
docker-compose logs -f

# Reiniciar o banco de dados
docker-compose restart
```

## 📈 Métricas do Projeto

- **25+ endpoints** organizados por módulos
- **Cobertura de testes** completa
- **Documentação interativa** com Swagger/Scalar
- **Validação robusta** com schemas Zod
- **Integração completa** com Google Maps
- **Dashboard de estatísticas** com gráficos interativos
- **Sistema de perfil** completo para usuários

## 🎯 Casos de Uso

### Para Usuários Finais
- **Pessoas com deficiência**: Encontrar locais acessíveis
- **Famílias**: Planejar passeios considerando acessibilidade
- **Profissionais**: Arquitetos, urbanistas, gestores públicos
- **ONGs**: Organizações que trabalham com inclusão
- **Usuários registrados**: 
  - Gerenciar perfil e informações pessoais
  - Visualizar estatísticas pessoais (relatórios criados, votos recebidos)
  - Acompanhar contribuições no sistema

### Para Organizações
- **Empresas**: Avaliar acessibilidade de estabelecimentos
- **Governo**: Monitorar políticas públicas de acessibilidade através do dashboard de estatísticas
- **Universidades**: Pesquisas sobre acessibilidade urbana com dados estatísticos
- **Mídia**: Cobertura de temas de inclusão com dados visuais
- **Analistas**: Visualizar tendências e padrões através de gráficos interativos

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

## 🎯 Impacto Social

### Objetivos Alcançados
- **Democratização**: Informações de acessibilidade disponíveis para todos
- **Inclusão**: Plataforma acessível para pessoas com deficiência
- **Comunidade**: Rede colaborativa de pessoas preocupadas com acessibilidade
- **Conscientização**: Sensibilização sobre a importância da acessibilidade

**Desenvolvido para promover acessibilidade e inclusão**

*"A acessibilidade não é um privilégio, é um direito fundamental de todos os cidadãos."*