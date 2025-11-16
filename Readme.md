[NODE__BADGE]: https://img.shields.io/badge/Node.js-20+-43853D?style=for-the-badge&logo=node.js&logoColor=white

[TYPESCRIPT__BADGE]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white

[FASTIFY__BADGE]: https://img.shields.io/badge/Fastify-202020?style=for-the-badge&logo=fastify&logoColor=white

[POSTGRESQL__BADGE]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white

[DOCKER__BADGE]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white

[JWT__BADGE]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white

[VITEST__BADGE]: https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white

[REACT__BADGE]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB

[TAILWIND__BADGE]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white

[GOOGLE_MAPS__BADGE]: https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white

[ZOD__BADGE]: https://img.shields.io/badge/Zod-3E63DD?style=for-the-badge&logo=zod&logoColor=white

[ARGON2__BADGE]: https://img.shields.io/badge/Argon2-FF6B6B?style=for-the-badge&logo=argon2&logoColor=white

[DRIZZLE__BADGE]: https://img.shields.io/badge/Drizzle_ORM-FF6B6B?style=for-the-badge&logo=drizzle&logoColor=white

[REACT_ROUTER__BADGE]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white

[RECHARTS__BADGE]: https://img.shields.io/badge/Recharts-FF6B6B?style=for-the-badge&logo=recharts&logoColor=white

[VITE__BADGE]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white

<h1 align="center" style="font-weight: bold;">🗺️ Mobiaccess: Mapa Colaborativo de Acessibilidade - UPX 4 💻</h1>

### 🔧 Backend

![node][NODE__BADGE] ![fastify][FASTIFY__BADGE] ![typescript][TYPESCRIPT__BADGE] ![postgresql][POSTGRESQL__BADGE] ![drizzle][DRIZZLE__BADGE] ![zod][ZOD__BADGE] ![jwt][JWT__BADGE]  ![argon2][ARGON2__BADGE] ![vitest][VITEST__BADGE] ![docker][DOCKER__BADGE] ![google maps][GOOGLE_MAPS__BADGE]


### 🎨 Frontend

![react][REACT__BADGE] ![typescript][TYPESCRIPT__BADGE] ![tailwind][TAILWIND__BADGE] ![react router][REACT_ROUTER__BADGE] ![recharts][RECHARTS__BADGE] ![vite][VITE__BADGE] ![google maps][GOOGLE_MAPS__BADGE]

<details open="open">
<summary>📑 Sumário</summary>

- [📋 Sobre o Projeto](#-sobre-o-projeto)
  - [🎯 Objetivos](#-objetivos)
  - [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [🏗️ Arquitetura do Sistema](#️-arquitetura-do-sistema)
  - [Backend (API REST)](#backend-api-rest)
  - [Frontend (Interface Web)](#frontend-interface-web)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚀 Como Executar o Projeto](#-como-executar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [1. Clone o Repositório](#1-clone-o-repositório)
  - [2. Configuração do Backend](#2-configuração-do-backend)
  - [3. Configuração do Frontend](#3-configuração-do-frontend)
  - [4. Acesse a Aplicação](#4-acesse-a-aplicação)
- [🔧 Configuração de Variáveis de Ambiente](#-configuração-de-variáveis-de-ambiente)
  - [Backend (.env)](#backend-env)
  - [Frontend (.env)](#frontend-env)
- [📚 Documentação](#-documentação)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [🧪 Testes](#-testes)
  - [Backend - Testes E2E (End-to-End)](#backend---testes-e2e-end-to-end)
    - [Cobertura de Testes](#cobertura-de-testes)
    - [Executar Testes](#executar-testes)
    - [Estrutura dos Testes](#estrutura-dos-testes)
- [📍 Endpoints da API](#-endpoints-da-api)
  - [Autenticação (`/auth`)](#autenticação-auth)
  - [Usuários (`/users`)](#usuários-users)
  - [Locais (`/places`)](#locais-places)
  - [Relatos (`/reports`)](#relatos-reports)
  - [Favoritos (`/favorites`)](#favoritos-favorites)
  - [Estatísticas (`/stats`)](#estatísticas-stats)
  - [Diagnósticos](#diagnósticos)
- [🎯 Campos de Acessibilidade](#-campos-de-acessibilidade)
- [📱 Páginas do Frontend](#-páginas-do-frontend)
  - [Páginas Públicas](#páginas-públicas)
  - [Páginas Protegidas (Requerem autenticação)](#páginas-protegidas-requerem-autenticação)
- [🛠️ Scripts Disponíveis](#️-scripts-disponíveis)
  - [Backend](#backend-1)
  - [Frontend](#frontend-1)
- [🌐 Desenvolvimento](#-desenvolvimento)
  - [CORS Configurado](#cors-configurado)
  - [Docker para Banco de Dados](#docker-para-banco-de-dados)
- [📈 Métricas do Projeto](#-métricas-do-projeto)
- [🎯 Casos de Uso](#-casos-de-uso)
  - [Para Usuários Finais](#para-usuários-finais)
  - [Para Organizações](#para-organizações)
- [📄 Licença](#-licença)
- [🎯 Impacto Social](#-impacto-social)
  - [Objetivos Alcançados](#objetivos-alcançados)
- [🤝 Colaboradores](#-colaboradores)

</details>

## 📋 Sobre o Projeto

O **Mobiaccess: Mapa Colaborativo de Acessibilidade** é uma plataforma completa que permite aos usuários compartilhar informações sobre a acessibilidade de locais públicos, criando um mapa colaborativo que ajuda pessoas com deficiência a navegar pela cidade com mais facilidade e segurança.

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
- ⭐ **Sistema de Favoritos**: Usuários podem salvar locais favoritos para acesso rápido
- 👤 **Página de Perfil**: Perfil completo do usuário com:
  - Visualização e edição de informações pessoais
  - Estatísticas pessoais (relatórios criados, votos recebidos, locais favoritos)
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
- **Testes E2E**: Cobertura completa de testes end-to-end para todas as rotas da API
- **Otimizações de Performance**: Queries otimizadas com agregações SQL, paralelização de requisições e redução de N+1 queries

### Frontend (Interface Web)
- **React.js + TypeScript**: Interface dinâmica e reativa
- **Tailwind CSS**: Estilização responsiva e moderna
- **React Router**: Navegação fluida entre páginas
- **Axios**: Comunicação com APIs
- **Google Maps API**: Mapas interativos no frontend
- **Recharts**: Biblioteca de gráficos para visualização de dados
- **PWA Support**: Suporte a Progressive Web App com favicons e web manifest

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

### Backend - Testes E2E (End-to-End)

O backend possui uma suíte completa de testes E2E implementada com **Vitest** e **Supertest**, garantindo que todas as rotas da API funcionem corretamente em cenários reais. Os testes cobrem validação de schemas, autenticação, autorização, tratamento de erros e casos de uso completos.

#### Cobertura de Testes
**Total: 32 arquivos de teste** cobrindo todas as rotas da API com cobertura completa de casos de sucesso, erros, validações e autorizações.

#### Executar Testes

```bash
# Executar todos os testes
npm test

# Testes com cobertura de código
npm run test:coverage

# Testes em modo watch (desenvolvimento)
npm run test:watch

# Testar CORS
npm run test:cors
```

#### Estrutura dos Testes

Cada rota possui testes que verificam:
- ✅ **Casos de sucesso**: Requisições válidas retornam status 200/201 com dados corretos
- ✅ **Validação de schemas**: Dados inválidos retornam status 400 com mensagens apropriadas
- ✅ **Autenticação**: Rotas protegidas requerem token JWT válido
- ✅ **Autorização**: Usuários só podem modificar seus próprios recursos
- ✅ **Tratamento de erros**: Erros são tratados adequadamente (404, 500, etc.)
- ✅ **Paginação**: Endpoints com paginação funcionam corretamente
- ✅ **Filtros e busca**: Parâmetros de query são validados e aplicados

## 📍 Endpoints da API

Aqui você pode encontrar as principais rotas da API organizadas por serviço.

### Autenticação (`/auth`)

| route | description |
|-------|------------|
| <kbd>POST /auth/register</kbd> | Registrar novo usuário no sistema |
| <kbd>POST /auth/login</kbd> | Autenticar usuário e obter token JWT |
| <kbd>POST /auth/logout</kbd> | Fazer logout do usuário |

### Usuários (`/users`)

| route | description |
|-------|------------|
| <kbd>GET /users/me</kbd> | Obter dados do usuário autenticado |
| <kbd>PUT /users/me</kbd> | Atualizar dados do usuário autenticado |
| <kbd>DELETE /users/me</kbd> | Excluir conta do usuário autenticado |
| <kbd>GET /users</kbd> | Buscar todos os usuários do sistema |
| <kbd>GET /users/me/stats</kbd> | Obter estatísticas do usuário (relatórios, votos, favoritos) |

### Locais (`/places`)

| route | description |
|-------|------------|
| <kbd>GET /places/search-nearby</kbd> | Buscar locais próximos a uma localização |
| <kbd>POST /places/check-or-create</kbd> | Verificar se local existe ou criar novo local |
| <kbd>GET /places/:placeId</kbd> | Obter detalhes completos de um local específico |
| <kbd>PUT /places/:placeId</kbd> | Atualizar informações de um local |
| <kbd>GET /places</kbd> | Buscar todos os locais cadastrados |
| <kbd>GET /places/with-reports</kbd> | Buscar locais com relatos (suporta filtros, ordenação e busca) |
| <kbd>GET /places/:placeId/accessibility-stats</kbd> | Obter estatísticas de acessibilidade de um local |

### Relatos (`/reports`)

| route | description |
|-------|------------|
| <kbd>POST /places/:placeId/reports</kbd> | Criar novo relato sobre acessibilidade de um local |
| <kbd>GET /places/:placeId/reports</kbd> | Buscar todos os relatos de um local específico |
| <kbd>GET /reports</kbd> | Listar todos os relatos do sistema |
| <kbd>GET /reports/:reportId</kbd> | Obter detalhes de um relato específico |
| <kbd>PUT /reports/:reportId</kbd> | Atualizar informações de um relato |
| <kbd>DELETE /reports/:reportId</kbd> | Remover um relato do sistema |
| <kbd>POST /reports/:reportId/votes</kbd> | Votar positivamente em um relato |
| <kbd>DELETE /reports/:reportId/votes</kbd> | Remover voto de um relato |

### Favoritos (`/favorites`)

| route | description |
|-------|------------|
| <kbd>POST /places/:placeId/favorites</kbd> | Adicionar ou remover local dos favoritos (toggle) |
| <kbd>GET /places/:placeId/favorites/check</kbd> | Verificar se um local está nos favoritos do usuário |
| <kbd>GET /users/me/favorites</kbd> | Listar todos os locais favoritos do usuário (com paginação) |

### Estatísticas (`/stats`)

| route | description |
|-------|------------|
| <kbd>GET /stats/general</kbd> | Obter estatísticas gerais do sistema (usuários, relatórios, locais, votos) |
| <kbd>GET /stats/reports/trends</kbd> | Obter tendências de relatos ao longo do tempo |
| <kbd>GET /stats/reports/by-type</kbd> | Obter relatos agrupados por tipo |
| <kbd>GET /stats/reports/accessibility-features</kbd> | Obter estatísticas de características de acessibilidade |

### Diagnósticos

| route | description |
|-------|------------|
| <kbd>GET /ping</kbd> | Health check do servidor e banco de dados |

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
- **Detalhes do Local** (`/details/:placeId`): Detalhes completos de um local específico com opção de favoritar
- **Locais** (`/places`): Lista de locais com comentários, filtros e ordenação
- **Meus Favoritos** (`/favorites`): Página com todos os locais favoritos do usuário
- **Perfil** (`/profile`): Página de perfil do usuário com:
  - Visualização e edição de informações pessoais
  - Estatísticas pessoais (relatórios criados, votos recebidos, locais favoritos)
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

- **32 endpoints** organizados por módulos, todos com cobertura completa de testes E2E
- **32 arquivos de teste** com 192+ testes cobrindo todos os endpoints
- **Cobertura de testes** completa
- **Documentação interativa** com Swagger/Scalar
- **Validação robusta** com schemas Zod
- **Integração completa** com Google Maps
- **Dashboard de estatísticas** com gráficos interativos
- **Sistema de perfil** completo para usuários
- **Otimizações de performance**: Queries do backend otimizadas com agregações SQL, paralelização de requisições e redução de N+1 queries

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

## 🤝 Colaboradores

Agradecimento especial a todas as pessoas que contribuíram para este projeto.

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/piresvitor">
        <img src="https://github.com/piresvitor.png" width="100px;" alt="Vitor Pires Profile Picture"/><br>
        <sub>
          <b>Vitor Pires</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/juliamofardinii">
        <img src="https://github.com/juliamofardinii.png" width="100px;" alt="Júlia Mofardini Profile Picture"/><br>
        <sub>
          <b>Júlia Mofardini</b>
        </sub>
      </a>
    </td>
  </tr>
</table>