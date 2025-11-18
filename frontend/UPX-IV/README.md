[REACT__BADGE]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB

[TYPESCRIPT__BADGE]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white

[TAILWIND__BADGE]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white

[REACT_ROUTER__BADGE]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white

[RECHARTS__BADGE]: https://img.shields.io/badge/Recharts-FF6B6B?style=for-the-badge&logo=recharts&logoColor=white

[GOOGLE_MAPS__BADGE]: https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white

[VITE__BADGE]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white

<h1 align="center" style="font-weight: bold;">🗺️ Mobiaccess: Mapa Colaborativo de Acessibilidade - Frontend 💻</h1>

![react][REACT__BADGE] ![typescript][TYPESCRIPT__BADGE] ![tailwind][TAILWIND__BADGE] ![react router][REACT_ROUTER__BADGE] ![recharts][RECHARTS__BADGE] ![vite][VITE__BADGE] ![google maps][GOOGLE_MAPS__BADGE]

<details open="open">
<summary>📑 Sumário</summary>

- [📋 Sobre o Projeto](#-sobre-o-projeto)
- [🎯 Objetivos](#-objetivos)
- [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [💻 Tecnologias Utilizadas](#-tecnologias-utilizadas)
  - [Core](#core)
  - [Estilização](#estilização)
  - [Navegação e Roteamento](#navegação-e-roteamento)
  - [Comunicação com API](#comunicação-com-api)
  - [Visualização de Dados](#visualização-de-dados)
  - [Integrações](#integrações)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚀 Instruções para Clonar e Executar o Projeto](#-instruções-para-clonar-e-executar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [1. Clone o Repositório](#1-clone-o-repositório)
  - [2. Instale as Dependências](#2-instale-as-dependências)
  - [3. Configure as Variáveis de Ambiente](#3-configure-as-variáveis-de-ambiente)
  - [4. Inicie o Servidor de Desenvolvimento](#4-inicie-o-servidor-de-desenvolvimento)
- [📱 Páginas da Aplicação](#-páginas-da-aplicação)
  - [Páginas Públicas](#páginas-públicas)
  - [Páginas Protegidas (Requerem autenticação)](#páginas-protegidas-requerem-autenticação)
- [🛠️ Scripts Disponíveis](#️-scripts-disponíveis)
- [🎨 Componentes UI](#-componentes-ui)
- [📚 Documentação Adicional](#-documentação-adicional)
- [🐛 Troubleshooting](#-troubleshooting)
  - [Problemas Comuns](#problemas-comuns)
- [📄 Licença](#-licença)

</details>

## 📋 Sobre o Projeto

O **Mobiaccess: Mapa Colaborativo de Acessibilidade** é uma plataforma que permite aos usuários compartilhar informações sobre a acessibilidade de locais públicos, criando um mapa colaborativo que ajuda pessoas com deficiência a navegar pela cidade com mais facilidade e segurança.

## 🎯 Objetivos

- **Democratizar a informação**: Permitir que qualquer pessoa contribua com informações sobre acessibilidade
- **Melhorar a mobilidade**: Facilitar o deslocamento de pessoas com deficiência
- **Criar comunidade**: Conectar pessoas que se preocupam com acessibilidade
- **Promover inclusão**: Tornar a cidade mais acessível para todos

## ✨ Funcionalidades Principais

- 🗺️ **Mapeamento de Locais**: Integração com Google Maps para localização precisa
- 🔍 **Busca Inteligente de Locais**: Campo de busca na página do mapa que permite:
  - Buscar locais por nome ou endereço (ex: "Shopping", "Hospital", "Restaurante")
  - Busca limitada à cidade de Sorocaba, SP
  - Autocomplete com resultados em tempo real
  - Histórico de buscas recentes (até 5 buscas)
  - Atualização automática do mapa para a localização encontrada
  - Abertura automática do popup com informações do local
  - Interface responsiva e otimizada para mobile e desktop
- 📍 **Sistema de Marcadores (Pins)**: Visualização de locais com comentários no mapa:
  - Toggle para ativar/desativar marcadores ao lado do campo de busca
  - Marcadores aparecem apenas em locais que possuem relatórios/comentários
  - Um marcador por local (sem duplicatas)
  - Clique no marcador abre popup com informações do local
  - Centralização automática do mapa ao clicar em um marcador
  - Marcadores começam desativados por padrão
- 📝 **Sistema de Relatos**: Usuários podem criar relatos sobre acessibilidade de locais
- 🎯 **Campos de Acessibilidade**: Relatos específicos para rampa de acesso, banheiro acessível, estacionamento acessível e acessibilidade visual
- 👍 **Sistema de Votação**: Comunidade pode validar e classificar relatos
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

## 💻 Tecnologias Utilizadas

O front-end do projeto foi desenvolvido com foco em **performance, usabilidade e experiência do usuário**, utilizando as seguintes tecnologias:

### Core
- **React.js** (v19.1.1): Biblioteca JavaScript para construção de interfaces dinâmicas e reativas
- **TypeScript** (v5.8.3): Superset do JavaScript que adiciona tipagem estática, aumentando a robustez e a manutenibilidade do código
- **Vite** (v7.2.2): Build tool rápida e moderna para desenvolvimento e produção

### Estilização
- **Tailwind CSS** (v4.1.13): Framework de utilitários para estilização rápida e responsiva
- **Radix UI**: Componentes acessíveis e customizáveis
- **Lucide React**: Biblioteca de ícones personalizáveis

### Navegação e Roteamento
- **React Router** (v7.9.1): Gerenciamento de rotas com lazy loading e code splitting

### Comunicação com API
- **Axios** (v1.13.2): Cliente HTTP para comunicação eficiente com APIs

### Visualização de Dados
- **Recharts** (v3.3.0): Biblioteca de gráficos para visualização de dados estatísticos

### Integrações
- **Google Maps API**: Integração com mapas interativos, permitindo visualização precisa de locais e rotas

## 📁 Estrutura do Projeto

```
UPX-IV/
├── src/
│   ├── pages/              # Páginas da aplicação
│   │   ├── home.tsx        # Página inicial
│   │   ├── map.tsx         # Página do mapa
│   │   ├── mapDetails.tsx  # Detalhes do local
│   │   ├── places.tsx      # Lista de locais com comentários
│   │   ├── favorites.tsx   # Locais favoritos do usuário
│   │   ├── profile.tsx     # Perfil do usuário
│   │   ├── stats.tsx       # Dashboard de estatísticas
│   │   ├── login.tsx       # Login
│   │   └── createUser.tsx  # Registro
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/             # Componentes de UI (Button, Card, Dialog, etc.)
│   │   └── navbar.tsx      # Barra de navegação
│   ├── features/           # Features organizadas por módulo
│   │   ├── home/           # Componentes da página inicial
│   │   ├── map/            # Componentes do mapa
│   │   └── mapDetails/     # Componentes de detalhes do local
│   ├── services/           # Serviços de API
│   │   ├── api.ts          # Configuração do Axios
│   │   ├── authService.ts  # Autenticação
│   │   ├── userService.ts # Gestão de usuários
│   │   ├── placeService.ts # Gestão de locais
│   │   ├── reportService.ts # Gestão de relatos
│   │   ├── statsService.ts # Estatísticas do sistema
│   │   ├── favoriteService.ts # Gestão de favoritos
│   │   └── googleMaps.ts   # Integração Google Maps
│   ├── routes/             # Configuração de rotas
│   │   ├── index.tsx       # Rotas principais
│   │   └── privateRoutes.tsx # Rotas protegidas
│   ├── context/            # Context API
│   │   ├── AuthContext.tsx # Contexto de autenticação
│   │   └── useAuthContext.tsx # Hook de autenticação
│   ├── hooks/              # Custom hooks
│   ├── layouts/            # Layouts da aplicação
│   ├── lib/                # Utilitários
│   └── assets/             # Assets estáticos
├── public/                 # Arquivos públicos
├── Dockerfile              # Dockerfile para deploy
├── .dockerignore           # Arquivos ignorados no Docker
├── vite.config.ts          # Configuração do Vite
├── package.json            # Dependências do projeto
└── README.md               # Este arquivo
```

## 🚀 Instruções para Clonar e Executar o Projeto

### Pré-requisitos

- **Node.js** (v20+)
- **npm** ou **yarn**
- **Chave da API do Google Maps**

### 1. Clone o Repositório

```bash
git clone https://github.com/piresvitor/Upx-IV.git
cd frontend/UPX-IV
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `frontend/UPX-IV`:

```env
# URL da API Backend
VITE_API_URL=http://localhost:3333

# Chave da API do Google Maps
VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui
```

**Nota**: No Vite, todas as variáveis de ambiente devem começar com `VITE_` para serem expostas ao código do frontend. Essas variáveis podem ser acessadas via `import.meta.env.VITE_NOME_DA_VARIAVEL`.

### 4. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📱 Páginas da Aplicação

### Páginas Públicas

- **Home** (`/`): Página inicial com informações sobre o projeto
- **Login** (`/login`): Página de autenticação
- **Registro** (`/account/register`): Página de cadastro de novos usuários

### Páginas Protegidas (Requerem autenticação)

- **Mapa** (`/map`): Mapa interativo com locais e relatórios de acessibilidade
  - Campo de busca inteligente com autocomplete
  - Histórico de buscas recentes
  - Busca limitada à cidade de Sorocaba, SP
  - Atualização automática do mapa e abertura de popup ao selecionar local
  - **Sistema de marcadores (pins)**: Toggle para mostrar/ocultar marcadores de locais com comentários
    - Marcadores aparecem apenas em locais que possuem relatórios
    - Um marcador por local
    - Clique no marcador abre popup e centraliza o mapa
  - Botão de ajuda com instruções de uso
  - Interface responsiva para mobile e desktop
- **Detalhes do Local** (`/details/:placeId`): Detalhes completos de um local específico com opção de favoritar
- **Locais** (`/places`): Lista de locais com comentários, filtros por tipo, ordenação e busca
- **Meus Favoritos** (`/favorites`): Página com todos os locais favoritos do usuário para acesso rápido
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

```bash
# Inicia servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Executa linting
npm run lint
```

## 🎨 Componentes UI

O projeto utiliza componentes acessíveis do Radix UI:

- **Button**: Botões customizáveis
- **Card**: Cards para conteúdo
- **Dialog**: Modais e diálogos
- **Input**: Campos de entrada
- **Label**: Labels de formulário
- **Navigation Menu**: Menu de navegação
- **Popover**: Popovers e tooltips
- **Checkbox**: Checkboxes
- **Textarea**: Áreas de texto

## 📚 Documentação Adicional

- **[README Principal](../../Readme.md)**: Documentação completa do projeto
- **[Backend Documentation](../../Backend/docs/README.md)**: Documentação da API

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro ao carregar Google Maps**
   - Verifique se a chave da API está configurada no `.env`
   - Certifique-se de que a chave tem as permissões corretas

2. **Erro de CORS**
   - Verifique se o backend está rodando
   - Confirme que a URL da API está correta no `.env`

3. **Páginas não carregam**
   - Verifique se todas as dependências foram instaladas
   - Execute `npm install` novamente


**Desenvolvido para promover acessibilidade e inclusão**

*"A acessibilidade não é um privilégio, é um direito fundamental de todos os cidadãos."*
