# Documentação da API - Mapa Colaborativo de Acessibilidade

## Visão Geral

Esta API permite gerenciar um sistema de mapeamento colaborativo de acessibilidade, onde usuários podem registrar locais, criar relatos sobre acessibilidade e interagir com o sistema através de autenticação JWT.

## Arquitetura do Sistema

Para uma visão completa da arquitetura e componentes do sistema, consulte:
- **[Diagrama de Componentes](./COMPONENT_DIAGRAM.md)** - Visão detalhada da arquitetura, componentes existentes e futuros
- **[Diagrama de Caso de Uso](./USE_CASE_DIAGRAM.md)** - Interações entre usuários e funcionalidades do sistema

## Estrutura da API

### 🔐 Autenticação
- **Base URL**: `/auth`
- **Documentação**: [API_AUTH_DOCUMENTATION.md](./API_AUTH_DOCUMENTATION.md)
- **Endpoints**:
  - `POST /auth/register` - Registrar novo usuário
  - `POST /auth/login` - Fazer login
  - `POST /auth/logout` - Fazer logout

### 👤 Usuários
- **Base URL**: `/users`
- **Documentação**: [API_USERS_DOCUMENTATION.md](./API_USERS_DOCUMENTATION.md)
- **Endpoints**:
    - `GET /users/me` - Obter dados do usuário
    - `PUT /users/me` - Atualizar dados do usuário
    - `DELETE /users/me` - Excluir conta do usuário
    - `GET /users` - Buscar todos os usuários

    ### 📍 Locais
    - **Base URL**: `/places`
    - **Documentação**: [API_PLACES_DOCUMENTATION.md](./API_PLACES_DOCUMENTATION.md)
    - **Endpoints**:
      - `GET /places/search-nearby` - Buscar locais próximos
      - `POST /places/check-or-create` - Verificar ou criar local
      - `GET /places/:placeId` - Obter detalhes de um local
      - `PUT /places/:placeId` - Atualizar um local
      - `GET /places` - Buscar todos os locais
      - `GET /places/:placeId/accessibility-stats` - Estatísticas de acessibilidade do local

### 📝 Relatos
- **Base URLs**:
  - `/places/:placeId/reports` (relatos por local)
  - `/reports` (relatos gerais)
- **Documentação**: [API_REPORTS_DOCUMENTATION.md](./API_REPORTS_DOCUMENTATION.md)
- **Endpoints**:
  - `POST /places/:placeId/reports` - Criar relato para local (com campos de acessibilidade)
  - `GET /places/:placeId/reports` - Buscar relatos de um local
  - `GET /reports` - Listar relatos com filtros (type, user_id)
  - `GET /reports/:reportId` - Obter um relato
  - `PUT /reports/:reportId` - Atualizar (somente autor)
  - `DELETE /reports/:reportId` - Remover (somente autor)
  - `POST /reports/:reportId/votes` - Votar em um relato
  - `DELETE /reports/:reportId/votes` - Remover voto de um relato
- **Novos Campos de Acessibilidade**:
  - `rampaAcesso` (boolean) - Rampa de acesso disponível
  - `banheiroAcessivel` (boolean) - Banheiro adaptado para cadeirantes
  - `estacionamentoAcessivel` (boolean) - Vagas especiais para PCD
  - `acessibilidadeVisual` (boolean) - Recursos para deficientes visuais

### 📊 Estatísticas
- **Base URL**: `/stats`
- **Documentação**: [API_STATS_DOCUMENTATION.md](./API_STATS_DOCUMENTATION.md)
- **Endpoints**:
  - `GET /stats/general` - Estatísticas gerais da plataforma
  - `GET /stats/reports/trends` - Tendências de relatos ao longo do tempo
  - `GET /stats/reports/by-type` - Relatos agrupados por tipo
  - `GET /stats/reports/accessibility-features` - Estatísticas de características de acessibilidade

### 👨‍💼 Administração (Futuro)
- **Base URL**: `/admin`
- **Endpoints**:
  - `GET /admin/reports` - Gerenciar relatos
  - `PUT /admin/reports/:id` - Moderar relato
  - `DELETE /admin/reports/:id` - Remover relato
  - `GET /admin/users` - Gerenciar usuários
  - `PUT /admin/users/:id` - Atualizar usuário
  - `DELETE /admin/users/:id` - Suspender usuário
  - `POST /admin/moderate` - Ações de moderação

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos:

1. Faça login em `/auth/login`
2. Use o token retornado no header: `Authorization: Bearer <token>`
3. O token expira automaticamente após um período determinado

## Configuração

### Variáveis de Ambiente Necessárias

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT
JWT_SECRET=your_jwt_secret_here

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Server
NODE_ENV=development
PORT=3333
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autenticado
- `404` - Recurso não encontrado
- `409` - Conflito (ex: email já em uso)
- `500` - Erro interno do servidor

## Exemplos de Uso

### Fluxo Completo de Uso

1. **Registrar usuário**:
   ```bash
   POST /auth/register
   ```

2. **Fazer login**:
   ```bash
   POST /auth/login
   ```

3. **Buscar locais próximos**:
   ```bash
   GET /places/search-nearby?latitude=-23.5505&longitude=-46.6333
   ```

4. **Verificar/criar local**:
   ```bash
   POST /places/check-or-create
   ```

5. **Criar relato**:
   ```bash
   POST /places/:placeId/reports
   ```

6. **Visualizar relatos**:
   ```bash
   GET /places/:placeId/reports
   ```

7. **Ver estatísticas de acessibilidade**:
   ```bash
   GET /places/:placeId/accessibility-stats
   ```

## Arquivos de Teste

- [requisicoes-auth-users.http](./requisicoes-auth-users.http) - Testes para autenticação e usuários
- [requisicoes-places.http](./requisicoes-places.http) - Testes para locais
- [requisicoes-reports.http](./requisicoes-reports.http) - Testes para relatos
- [requisicoes-votes.http](./requisicoes-votes.http) - Testes para votação em relatos
- [requisicoes-stats.http](./requisicoes-stats.http) - Testes para estatísticas
- [requisicoes-accessibility-stats.http](./requisicoes-accessibility-stats.http) - Testes para estatísticas de acessibilidade

## Documentação de Arquitetura

- [COMPONENT_DIAGRAM.md](./COMPONENT_DIAGRAM.md) - Diagrama de componentes e arquitetura do sistema

## Documentação Swagger

Quando em modo de desenvolvimento, a documentação interativa está disponível em:
- **Scalar API Reference**: `http://localhost:3333/docs`

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação específica de cada módulo
2. Consulte os arquivos de exemplo de requisições
3. Verifique os logs do servidor para erros detalhados
