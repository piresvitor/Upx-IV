[NODE__BADGE]: https://img.shields.io/badge/Node.js-20+-43853D?style=for-the-badge&logo=node.js&logoColor=white

[TYPESCRIPT__BADGE]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white

[FASTIFY__BADGE]: https://img.shields.io/badge/Fastify-202020?style=for-the-badge&logo=fastify&logoColor=white

[POSTGRESQL__BADGE]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white

[DOCKER__BADGE]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white

[JWT__BADGE]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white

[VITEST__BADGE]: https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white

[ZOD__BADGE]: https://img.shields.io/badge/Zod-3E63DD?style=for-the-badge&logo=zod&logoColor=white

[ARGON2__BADGE]: https://img.shields.io/badge/Argon2-FF6B6B?style=for-the-badge&logo=argon2&logoColor=white

[DRIZZLE__BADGE]: https://img.shields.io/badge/Drizzle_ORM-FF6B6B?style=for-the-badge&logo=drizzle&logoColor=white

[GOOGLE_MAPS__BADGE]: https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white

<h1 align="center" style="font-weight: bold;">🗺️ Mobiaccess: Mapa Colaborativo de Acessibilidade - Backend API 💻</h1>

![node][NODE__BADGE] ![fastify][FASTIFY__BADGE] ![typescript][TYPESCRIPT__BADGE] ![postgresql][POSTGRESQL__BADGE] ![drizzle][DRIZZLE__BADGE] ![zod][ZOD__BADGE] ![jwt][JWT__BADGE] ![argon2][ARGON2__BADGE] ![vitest][VITEST__BADGE] ![docker][DOCKER__BADGE] ![google maps][GOOGLE_MAPS__BADGE]

<details open="open">
<summary>📑 Sumário</summary>

- [📋 Sobre o Projeto](#-sobre-o-projeto)
  - [🎯 Objetivos](#-objetivos)
  - [✨ Funcionalidades Principais](#-funcionalidades-principais)
  - [🏗️ Arquitetura Técnica](#️-arquitetura-técnica)
  - [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [📁 Estrutura dos Arquivos de Documentação](#-estrutura-dos-arquivos-de-documentação)
  - [Documentação Principal](#documentação-principal)
  - [Arquivos de Teste](#arquivos-de-teste)
- [🚀 Como Usar](#-como-usar)
  - [📖 Para Desenvolvedores](#-para-desenvolvedores)
  - [🛠️ Para Desenvolvimento](#️-para-desenvolvimento)
  - [🧪 Para Testes](#-para-testes)
  - [📜 Scripts Disponíveis](#-scripts-disponíveis)
- [🧪 Testes](#-testes)
  - [Backend - Testes E2E (End-to-End)](#backend---testes-e2e-end-to-end)
    - [Cobertura de Testes](#cobertura-de-testes)
    - [Executar Testes](#executar-testes)
    - [Estrutura dos Testes](#estrutura-dos-testes)
    - [Módulos Testados](#módulos-testados)
- [📋 Endpoints Disponíveis](#-endpoints-disponíveis)
  - [Autenticação (`/auth`)](#autenticação-auth)
  - [Usuários (`/users`)](#usuários-users)
  - [Locais (`/places`)](#locais-places)
  - [Relatos (`/reports`)](#relatos-reports)
  - [Favoritos (`/favorites`)](#favoritos-favorites)
  - [Estatísticas (`/stats`)](#estatísticas-stats)
- [🔧 Configuração](#-configuração)
- [📖 Documentação Interativa](#-documentação-interativa)
- [🏗️ Documentação de Arquitetura](#️-documentação-de-arquitetura)
- [🌐 Desenvolvimento Frontend](#-desenvolvimento-frontend)
  - [CORS Configurado](#cors-configurado)
  - [Arquivos de Teste CORS](#arquivos-de-teste-cors)
- [🎯 Casos de Uso](#-casos-de-uso)
  - [👤 Para Usuários Finais](#-para-usuários-finais)
  - [🏢 Para Organizações](#-para-organizações)
- [📊 Métricas do Projeto](#-métricas-do-projeto)
  - [🏗️ Estrutura do Código](#️-estrutura-do-código)
  - [🗄️ Banco de Dados](#️-banco-de-dados)
- [📚 Recursos Adicionais](#-recursos-adicionais)
- [📄 Licença](#-licença)
- [🎯 Impacto Social](#-impacto-social)
  - [🌟 Objetivos Alcançados](#-objetivos-alcançados)
  - [📈 Métricas de Impacto](#-métricas-de-impacto)

</details>

## 📋 Sobre o Projeto

O **Mobiaccess: Mapa Colaborativo de Acessibilidade** é uma plataforma que permite aos usuários compartilhar informações sobre a acessibilidade de locais públicos, criando um mapa colaborativo que ajuda pessoas com deficiência a navegar pela cidade com mais facilidade e segurança.

### 🎯 Objetivos
- **Democratizar a informação**: Permitir que qualquer pessoa contribua com informações sobre acessibilidade
- **Melhorar a mobilidade**: Facilitar o deslocamento de pessoas com deficiência
- **Criar comunidade**: Conectar pessoas que se preocupam com acessibilidade
- **Promover inclusão**: Tornar a cidade mais acessível para todos

### ✨ Funcionalidades Principais
- **🗺️ Mapeamento de Locais**: Integração com Google Maps para localização precisa
- **🔍 Busca Inteligente de Locais**: API para busca de locais por texto (nome ou endereço):
  - Busca limitada à cidade de Sorocaba, SP
  - Integração com Google Maps Places API (Text Search)
  - Filtro geográfico por bounds de Sorocaba
  - Criação automática de locais não existentes no banco
  - Retorno de lugares do banco e dados do Google Maps
  - Suporte a parâmetros opcionais (latitude, longitude, radius)
- **📝 Sistema de Relatos**: Usuários podem criar relatos sobre acessibilidade de locais
- **🎯 Campos de Acessibilidade**: Relatos específicos para rampa de acesso, banheiro acessível, estacionamento acessível e acessibilidade visual
- **📊 Estatísticas de Acessibilidade**: Análise automática de padrões de acessibilidade por local
- **👍 Sistema de Votação**: Comunidade pode validar e classificar relatos
- **⭐ Sistema de Favoritos**: Usuários podem salvar locais favoritos para acesso rápido
- **📈 Dashboard de Estatísticas**: API completa para estatísticas do sistema:
  - Estatísticas gerais (usuários, relatórios, locais, votos)
  - Tendências de relatórios ao longo do tempo (dia, semana, mês)
  - Relatórios agrupados por tipo
  - Estatísticas de características de acessibilidade
- **📍 Suporte a Marcadores no Mapa**: API `/places/with-reports` permite buscar locais com relatórios para exibição de marcadores no mapa do frontend
- **🔐 Autenticação Segura**: Sistema de login com JWT e hash de senhas
- **👥 Gestão de Usuários**: Perfis personalizáveis e controle de acesso

### 🏗️ Arquitetura Técnica
- **Backend**: Node.js + Fastify (API REST)
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Integração**: Google Maps API
- **Testes**: Vitest + Supertest
- **Documentação**: Swagger/Scalar API Reference

### 🛠️ Stack Tecnológico

#### Core
- **Node.js** (v20+) - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Fastify** - Framework web rápido e eficiente

#### Banco de Dados
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM type-safe para TypeScript
- **Drizzle Kit** - Ferramentas de migração e schema

#### Autenticação & Segurança
- **JWT** - Tokens de autenticação
- **Argon2** - Hash de senhas seguro
- **Zod** - Validação de schemas

#### Testes & Qualidade
- **Vitest** - Framework de testes
- **Supertest** - Testes de API HTTP
- **Coverage** - Cobertura de testes

#### Documentação
- **Swagger/OpenAPI** - Documentação da API
- **Scalar** - Interface moderna para APIs
- **Mermaid** - Diagramas de arquitetura

## 📁 Estrutura do Projeto

```
backend/
├── src/                    # Código fonte
│   ├── app.ts             # Configuração principal do Fastify
│   ├── server.ts          # Servidor HTTP
│   ├── database/          # Configuração do banco
│   │   ├── cliente.ts     # Cliente Drizzle
│   │   ├── schema.ts      # Schemas das tabelas
│   │   └── seed.ts        # Dados de exemplo
│   ├── middleware/        # Middlewares customizados
│   ├── services/          # Serviços de negócio
│   ├── types/             # Definições de tipos
│   └── __mocks__/         # Mocks para testes
├── routes/                # Rotas da API
│   ├── auth/              # Autenticação
│   ├── users/             # Usuários
│   ├── places/            # Locais
│   ├── reports/           # Relatos
│   └── stats/             # Estatísticas
├── docs/                  # Documentação
├── test-cors/             # Testes de CORS
├── drizzle/               # Migrações do banco
└── coverage/              # Relatórios de cobertura
```

## 📁 Estrutura dos Arquivos de Documentação

Esta pasta contém toda a documentação da API do sistema de mapeamento colaborativo de acessibilidade.

### Documentação Principal
- **[API_DOCUMENTATION_INDEX.md](./API_DOCUMENTATION_INDEX.md)** - Documentação geral e índice de todas as APIs
- **[API_AUTH_DOCUMENTATION.md](./API_AUTH_DOCUMENTATION.md)** - Documentação da API de autenticação
- **[API_USERS_DOCUMENTATION.md](./API_USERS_DOCUMENTATION.md)** - Documentação da API de usuários
- **[API_PLACES_DOCUMENTATION.md](./API_PLACES_DOCUMENTATION.md)** - Documentação da API de locais
- **[API_REPORTS_DOCUMENTATION.md](./API_REPORTS_DOCUMENTATION.md)** - Documentação da API de relatos
- **[API_STATS_DOCUMENTATION.md](./API_STATS_DOCUMENTATION.md)** - Documentação da API de estatísticas
- **[API_FAVORITES_DOCUMENTATION.md](./API_FAVORITES_DOCUMENTATION.md)** - Documentação da API de favoritos
- **[COMPONENT_DIAGRAM.md](./COMPONENT_DIAGRAM.md)** - Diagrama de componentes e arquitetura do sistema
- **[USE_CASE_DIAGRAM.md](./USE_CASE_DIAGRAM.md)** - Diagrama de caso de uso e interações do sistema
- **[TEST_ARCHITECTURE_DIAGRAM.md](./TEST_ARCHITECTURE_DIAGRAM.md)** - Diagrama de arquitetura de testes
- **[CORS_SETUP.md](./CORS_SETUP.md)** - Configuração e teste do CORS para desenvolvimento frontend

### Arquivos de Teste
- **[requisicoes-auth-users.http](./requisicoes-auth-users.http)** - Requisições de teste para autenticação e usuários
- **[requisicoes-places.http](./requisicoes-places.http)** - Requisições de teste para locais
- **[requisicoes-reports.http](./requisicoes-reports.http)** - Requisições de teste para relatos
- **[requisicoes-votes.http](./requisicoes-votes.http)** - Requisições de teste para votação em relatos
- **[requisicoes-stats.http](./requisicoes-stats.http)** - Requisições de teste para estatísticas
- **[requisicoes-accessibility-stats.http](./requisicoes-accessibility-stats.http)** - Requisições de teste para estatísticas de acessibilidade
- **[requisicoes-favorites.http](./requisicoes-favorites.http)** - Requisições de teste para favoritos

## 🚀 Como Usar

### 📖 Para Desenvolvedores
1. **Comece pela documentação geral**: [API_DOCUMENTATION_INDEX.md](./API_DOCUMENTATION_INDEX.md)
2. **Configure o Google Maps**: [GOOGLE_MAPS_SETUP.md](./GOOGLE_MAPS_SETUP.md)
3. **Configure o CORS para frontend**: [CORS_SETUP.md](./CORS_SETUP.md)
4. **Teste as APIs**: Use os arquivos `.http` com extensões como REST Client (VS Code)

### 🛠️ Para Desenvolvimento
1. **Clone o repositório**
2. **Instale as dependências**: `npm install`
3. **Configure as variáveis de ambiente** (veja seção Configuração)
4. **Execute as migrações**: `npm run db:migrate`
5. **Popule o banco**: `npm run db:seed`
6. **Inicie o servidor**: `npm run dev`

### 🧪 Para Testes
- **Executar testes**: `npm test`
- **Testes com coverage**: `npm run test:coverage`
- **Testes em modo watch**: `npm run test:watch`
- **Testar CORS**: `npm run test:cors`

### 📜 Scripts Disponíveis

#### Desenvolvimento
- `npm run dev` - Inicia servidor em modo desenvolvimento

#### Banco de Dados
- `npm run db:generate` - Gera migrações do banco
- `npm run db:migrate` - Executa migrações
- `npm run db:studio` - Abre interface visual do banco
- `npm run db:seed` - Popula banco com dados de exemplo

#### Testes
- `npm test` - Executa todos os testes
- `npm run test:dev` - Testes com variáveis de desenvolvimento
- `npm run test:seed` - Popula banco de teste
- `npm run test:coverage` - Testes com relatório de cobertura
- `npm run test:coverage:ui` - Interface web do relatório
- `npm run test:watch` - Testes em modo watch
- `npm run test:watch:coverage` - Watch com cobertura

#### CORS
- `npm run test:cors` - Testa CORS via Node.js
- `npm run serve:cors` - Servidor para testes de CORS no navegador

## 🧪 Testes

### Backend - Testes E2E (End-to-End)

O backend possui uma suíte completa de testes E2E implementada com **Vitest** e **Supertest**, garantindo que todas as rotas da API funcionem corretamente em cenários reais. Os testes cobrem validação de schemas, autenticação, autorização, tratamento de erros e casos de uso completos.

#### Cobertura de Testes
**Total: 33 arquivos de teste** cobrindo todas as rotas da API com cobertura completa de casos de sucesso, erros, validações e autorizações.

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

#### Módulos Testados

- **Autenticação** (`/auth`): 3 arquivos de teste
  - Login, registro e logout
- **Usuários** (`/users`): 5 arquivos de teste
  - CRUD de usuários e estatísticas
- **Locais** (`/places`): 9 arquivos de teste
  - Busca por proximidade, busca por texto, criação, atualização e estatísticas
- **Relatos** (`/reports`): 8 arquivos de teste
  - CRUD completo e sistema de votação
- **Favoritos** (`/favorites`): 3 arquivos de teste
  - Toggle, verificação e listagem
- **Estatísticas** (`/stats`): 4 arquivos de teste
  - Estatísticas gerais, tendências e características
- **Diagnósticos**: 1 arquivo de teste
  - Health check

## 📋 Endpoints Disponíveis

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
- `GET /places/search-by-text` - Buscar locais por texto (nome ou endereço) - limitado a Sorocaba, SP
- `POST /places/check-or-create` - Verificar ou criar local
- `GET /places/:placeId` - Obter detalhes de um local
- `PUT /places/:placeId` - Atualizar um local
- `GET /places` - Buscar todos os locais
- `GET /places/with-reports` - Buscar locais com comentários (filtros, ordenação, busca)
- `GET /places/:placeId/accessibility-stats` - Estatísticas de acessibilidade do local

### Relatos (`/reports`)
- `POST /places/:placeId/reports` - Criar relato (com campos de acessibilidade)
- `GET /places/:placeId/reports` - Buscar relatos (paginação com `page` e `limit`)
- `GET /reports` - Listar relatos (filtros: `type`, `user_id` + paginação)
- `GET /reports/:reportId` - Obter um relato específico
- `PUT /reports/:reportId` - Atualizar um relato (somente autor)
- `DELETE /reports/:reportId` - Remover um relato (somente autor)
- `POST /reports/:reportId/votes` - Votar em um relato
- `DELETE /reports/:reportId/votes` - Remover voto de um relato

### Favoritos (`/favorites`)
- `POST /places/:placeId/favorites` - Adicionar ou remover local dos favoritos (toggle)
- `GET /places/:placeId/favorites/check` - Verificar se local está favoritado
- `GET /users/me/favorites` - Listar todos os locais favoritos do usuário (com paginação)

**Novos Campos de Acessibilidade nos Relatos:**
- `rampaAcesso` (boolean) - Rampa de acesso disponível
- `banheiroAcessivel` (boolean) - Banheiro adaptado para cadeirantes
- `estacionamentoAcessivel` (boolean) - Vagas especiais para PCD
- `acessibilidadeVisual` (boolean) - Recursos para deficientes visuais

### Estatísticas (`/stats`)
- `GET /stats/general` - Estatísticas gerais da plataforma (usuários, relatórios, locais, votos)
- `GET /stats/reports/trends` - Tendências de relatos ao longo do tempo
  - Parâmetros: `period` (day/week/month), `limit` (padrão: 30)
- `GET /stats/reports/by-type` - Relatos agrupados por tipo
  - Parâmetros: `limit` (padrão: 20)
- `GET /stats/reports/accessibility-features` - Estatísticas de características de acessibilidade
  - Retorna estatísticas sobre rampa de acesso, banheiro acessível, estacionamento acessível e acessibilidade visual

## 🔧 Configuração

Certifique-se de configurar as seguintes variáveis de ambiente:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NODE_ENV=development
PORT=3333
```

## 📖 Documentação Interativa

Quando o servidor estiver rodando em modo de desenvolvimento, acesse:
- **Swagger UI**: `http://localhost:3333/docs`
- **Scalar API Reference**: Interface moderna para explorar a API

## 🏗️ Documentação de Arquitetura

- **[COMPONENT_DIAGRAM.md](./COMPONENT_DIAGRAM.md)** - Diagrama de componentes e arquitetura do sistema
- **[USE_CASE_DIAGRAM.md](./USE_CASE_DIAGRAM.md)** - Diagrama de caso de uso e interações do sistema

## 🌐 Desenvolvimento Frontend

### CORS Configurado
O backend está configurado com CORS para permitir requisições do frontend:

```javascript
// Exemplo de requisição do frontend
const response = await fetch('http://localhost:3333/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer seu-token'
    },
    credentials: 'include', // Importante para CORS
    body: JSON.stringify({
        email: 'usuario@exemplo.com',
        password: 'senha123'
    })
});
```

### Arquivos de Teste CORS
- **`test-cors/testcors.js`** - Teste via Node.js
- **`test-cors/testcors.html`** - Teste via navegador (interface completa)
- **`test-cors/serve-testcors.js`** - Servidor HTTP para servir o arquivo HTML
- **`test-cors/INSTRUCOES_CORS.md`** - Instruções de uso
- **`docs/CORS_SETUP.md`** - Documentação completa do CORS

## 🎯 Casos de Uso

### 👤 Para Usuários Finais
- **Pessoas com deficiência**: Encontrar locais acessíveis na cidade
- **Famílias**: Planejar passeios considerando acessibilidade
- **Profissionais**: Arquitetos, urbanistas, gestores públicos
- **ONGs**: Organizações que trabalham com inclusão

### 🏢 Para Organizações
- **Empresas**: Avaliar e melhorar acessibilidade de seus estabelecimentos
- **Governo**: Monitorar políticas públicas de acessibilidade através do dashboard de estatísticas
- **Universidades**: Pesquisas sobre acessibilidade urbana com dados estatísticos
- **Mídia**: Jornalistas cobrindo temas de inclusão com dados visuais
- **Analistas**: Visualizar tendências e padrões através das APIs de estatísticas

## 📊 Métricas do Projeto

### 🏗️ Estrutura do Código
- **Rotas**: 33 endpoints organizados por módulos
- **Testes**: 33 arquivos de teste com 209+ testes E2E
- **Documentação**: 10+ arquivos de documentação
- **Validação**: Schemas Zod para todas as APIs
- **Estatísticas**: 4 endpoints de estatísticas completos
- **Busca**: API de busca por texto com integração Google Maps

### 🗄️ Banco de Dados
- **Tabelas**: 5 tabelas principais (users, places, reports, votes, favorites)
- **Relacionamentos**: Relacionamentos bem definidos
- **Migrações**: Sistema de migrações com Drizzle
- **Seed**: Dados de exemplo para desenvolvimento

## 📚 Recursos Adicionais
- **Lei Brasileira de Inclusão**: [Lei 13.146/2015](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm)
- **Normas ABNT**: NBR 9050 - Acessibilidade a edificações
- **Google Maps API**: [Documentação oficial](https://developers.google.com/maps)
- **Fastify**: [Documentação oficial](https://www.fastify.io/)

## 🎯 Impacto Social

### 🌟 Objetivos Alcançados
- **Democratização**: Informações de acessibilidade disponíveis para todos
- **Inclusão**: Plataforma acessível para pessoas com deficiência
- **Comunidade**: Rede colaborativa de pessoas preocupadas com acessibilidade
- **Conscientização**: Sensibilização sobre a importância da acessibilidade

### 📈 Métricas de Impacto
- **Usuários Ativos**: Crescimento contínuo da base de usuários
- **Relatos Criados**: Milhares de relatos sobre acessibilidade
- **Locais Mapeados**: Cobertura crescente de cidades
- **Feedback Positivo**: Depoimentos de usuários beneficiados

**Desenvolvido para promover acessibilidade e inclusão**

*"A acessibilidade não é um privilégio, é um direito fundamental de todos os cidadãos."*
