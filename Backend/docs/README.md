# Documentação da API - Mapa Colaborativo de Acessibilidade

Esta pasta contém toda a documentação da API do sistema de mapeamento colaborativo de acessibilidade.

## 📁 Estrutura dos Arquivos

### Documentação Principal
- **[API_DOCUMENTATION_INDEX.md](./API_DOCUMENTATION_INDEX.md)** - Documentação geral e índice de todas as APIs
- **[API_AUTH_DOCUMENTATION.md](./API_AUTH_DOCUMENTATION.md)** - Documentação da API de autenticação
- **[API_USERS_DOCUMENTATION.md](./API_USERS_DOCUMENTATION.md)** - Documentação da API de usuários
- **[API_PLACES_DOCUMENTATION.md](./API_PLACES_DOCUMENTATION.md)** - Documentação da API de locais
- **[API_REPORTS_DOCUMENTATION.md](./API_REPORTS_DOCUMENTATION.md)** - Documentação da API de relatos
- **[API_STATS_DOCUMENTATION.md](./API_STATS_DOCUMENTATION.md)** - Documentação da API de estatísticas
- **[COMPONENT_DIAGRAM.md](./COMPONENT_DIAGRAM.md)** - Diagrama de componentes e arquitetura do sistema
- **[USE_CASE_DIAGRAM.md](./USE_CASE_DIAGRAM.md)** - Diagrama de caso de uso e interações do sistema

### Arquivos de Teste
- **[requisicoes-auth-users.http](./requisicoes-auth-users.http)** - Requisições de teste para autenticação e usuários
- **[requisicoes-places.http](./requisicoes-places.http)** - Requisições de teste para locais
- **[requisicoes-reports.http](./requisicoes-reports.http)** - Requisições de teste para relatos
- **[requisicoes-votes.http](./requisicoes-votes.http)** - Requisições de teste para votação em relatos
- **[requisicoes-stats.http](./requisicoes-stats.http)** - Requisições de teste para estatísticas

## 🚀 Como Usar

1. **Comece pela documentação geral**: [API_DOCUMENTATION_INDEX.md](./API_DOCUMENTATION_INDEX.md)
2. **Configure o Google Maps**: [GOOGLE_MAPS_SETUP.md](./GOOGLE_MAPS_SETUP.md)
3. **Teste as APIs**: Use os arquivos `.http` com extensões como REST Client (VS Code)

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
    - `POST /places/check-or-create` - Verificar ou criar local
    - `GET /places/:placeId` - Obter detalhes de um local
    - `PUT /places/:placeId` - Atualizar um local
    - `GET /places` - Buscar todos os locais

### Relatos
- `POST /places/:placeId/reports` - Criar relato
- `GET /places/:placeId/reports` - Buscar relatos (paginação com `page` e `limit`)
- `GET /reports` - Listar relatos (filtros: `type`, `user_id` + paginação)
- `GET /reports/:reportId` - Obter um relato específico
- `PUT /reports/:reportId` - Atualizar um relato (somente autor)
- `DELETE /reports/:reportId` - Remover um relato (somente autor)
- `POST /reports/:reportId/votes` - Votar em um relato
- `DELETE /reports/:reportId/votes` - Remover voto de um relato

### Estatísticas
- `GET /stats/general` - Estatísticas gerais da plataforma
- `GET /stats/reports/trends` - Tendências de relatos ao longo do tempo
- `GET /stats/reports/by-type` - Relatos agrupados por tipo

### Administração (Futuro)
- `GET /admin/reports` - Gerenciar relatos
- `PUT /admin/reports/:id` - Moderar relato
- `DELETE /admin/reports/:id` - Remover relato
- `GET /admin/users` - Gerenciar usuários
- `PUT /admin/users/:id` - Atualizar usuário
- `DELETE /admin/users/:id` - Suspender usuário
- `POST /admin/moderate` - Ações de moderação

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
