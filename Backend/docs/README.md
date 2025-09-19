# Documentação da API - Mapa Colaborativo de Acessibilidade

Esta pasta contém toda a documentação da API do sistema de mapeamento colaborativo de acessibilidade.

## 📁 Estrutura dos Arquivos

### Documentação Principal
- **[API_DOCUMENTATION_INDEX.md](./API_DOCUMENTATION_INDEX.md)** - Documentação geral e índice de todas as APIs
- **[API_AUTH_DOCUMENTATION.md](./API_AUTH_DOCUMENTATION.md)** - Documentação da API de autenticação
- **[API_USERS_DOCUMENTATION.md](./API_USERS_DOCUMENTATION.md)** - Documentação da API de usuários
- **[API_PLACES_DOCUMENTATION.md](./API_PLACES_DOCUMENTATION.md)** - Documentação da API de locais
- **[API_REPORTS_DOCUMENTATION.md](./API_REPORTS_DOCUMENTATION.md)** - Documentação da API de relatos

    ### Arquivos de Teste
    - **[requisicoes-auth-users.http](./requisicoes-auth-users.http)** - Requisições de teste para autenticação e usuários
    - **[requisicoes-places.http](./requisicoes-places.http)** - Requisições de teste para locais
    - **[requisicoes-reports.http](./requisicoes-reports.http)** - Requisições de teste para relatos

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

### Relatos (`/places/:placeId/reports`)
- `POST /places/:placeId/reports` - Criar relato
- `GET /places/:placeId/reports` - Buscar relatos

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
