# Documentação da API de Favoritos

## Visão Geral

A API de favoritos permite que usuários autenticados salvem locais favoritos para acesso rápido posteriormente. Os usuários podem adicionar ou remover locais dos favoritos, verificar se um local está favoritado e listar todos os seus locais favoritos.

## Endpoints

### 1. Adicionar ou Remover Local dos Favoritos (Toggle)

**POST** `/places/:placeId/favorites`

Adiciona um local aos favoritos do usuário autenticado, ou remove se já estiver favoritado.

#### Headers:
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Parâmetros:
- `placeId` (string, obrigatório): UUID do local no banco de dados

#### Exemplo de Requisição:
```http
POST /places/123e4567-e89b-12d3-a456-426614174000/favorites
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Resposta de Sucesso (200) - Adicionado aos favoritos:
```json
{
  "isFavorite": true,
  "message": "Local adicionado aos favoritos"
}
```

#### Resposta de Sucesso (200) - Removido dos favoritos:
```json
{
  "isFavorite": false,
  "message": "Local removido dos favoritos"
}
```

#### Resposta de Erro (404):
```json
{
  "error": "Local não encontrado"
}
```

#### Resposta de Erro (401):
```json
{
  "error": "Token inválido ou expirado"
}
```

#### Resposta de Erro (400):
```json
{
  "error": "ID do local deve ser um UUID válido"
}
```

### 2. Verificar se Local está Favoritado

**GET** `/places/:placeId/favorites/check`

Verifica se um local específico está nos favoritos do usuário autenticado.

#### Headers:
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Parâmetros:
- `placeId` (string, obrigatório): UUID do local no banco de dados

#### Exemplo de Requisição:
```http
GET /places/123e4567-e89b-12d3-a456-426614174000/favorites/check
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Resposta de Sucesso (200):
```json
{
  "isFavorite": true
}
```

ou

```json
{
  "isFavorite": false
}
```

#### Resposta de Erro (401):
```json
{
  "error": "Token inválido ou expirado"
}
```

#### Resposta de Erro (400):
```json
{
  "error": "ID do local deve ser um UUID válido"
}
```

### 3. Listar Locais Favoritos do Usuário

**GET** `/users/me/favorites`

Retorna todos os locais favoritos do usuário autenticado com paginação, incluindo contagem de comentários (relatos) e votos.

#### Headers:
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Parâmetros de Query:
- `page` (number, opcional): Página (padrão: 1, mínimo: 1)
- `limit` (number, opcional): Itens por página (padrão: 15, mínimo: 1, máximo: 15)

#### Exemplo de Requisição:
```http
GET /users/me/favorites?page=1&limit=15
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Resposta de Sucesso (200):
```json
{
  "places": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "placeId": "ChIJ...",
      "name": "Shopping Iguatemi Sorocaba",
      "address": "Rod. Sen. José Ermírio de Moraes, 1425",
      "latitude": -23.5015,
      "longitude": -47.4526,
      "types": ["shopping_mall", "establishment"],
      "rating": 4.5,
      "userRatingsTotal": 150,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "reportsCount": 5,
      "votesCount": 12,
      "favoritedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 15,
    "total": 1,
    "totalPages": 1
  }
}
```

#### Resposta de Sucesso (200) - Lista vazia:
```json
{
  "places": [],
  "pagination": {
    "page": 1,
    "limit": 15,
    "total": 0,
    "totalPages": 0
  }
}
```

#### Resposta de Erro (401):
```json
{
  "error": "Token inválido ou expirado"
}
```

#### Resposta de Erro (400):
```json
{
  "error": "Página deve ser um número válido maior que 0"
}
```

ou

```json
{
  "error": "Limite deve ser um número válido entre 1 e 15"
}
```

## Campos da Resposta

### Place Object (Lista de Favoritos)
- **`id`**: UUID do local no banco de dados
- **`placeId`**: Place ID do Google Maps
- **`name`**: Nome do local
- **`address`**: Endereço completo do local
- **`latitude`**: Latitude do local
- **`longitude`**: Longitude do local
- **`types`**: Array de tipos do local (ex: ["restaurant", "food"])
- **`rating`**: Avaliação do local (0-5)
- **`userRatingsTotal`**: Total de avaliações do Google Maps
- **`createdAt`**: Data de criação do registro no sistema
- **`updatedAt`**: Data da última atualização
- **`reportsCount`**: Número de relatos (comentários) do local
- **`votesCount`**: Número total de votos recebidos pelos relatos do local
- **`favoritedAt`**: Data em que o local foi adicionado aos favoritos

### Pagination Object
- **`page`**: Página atual
- **`limit`**: Itens por página
- **`total`**: Total de itens
- **`totalPages`**: Total de páginas

## Comportamento dos Endpoints

### POST /places/:placeId/favorites
- **Toggle**: Se o local já estiver favoritado, remove dos favoritos. Se não estiver, adiciona.
- **Validação**: Verifica se o local existe antes de adicionar/remover
- **Unicidade**: Um usuário só pode favoritar o mesmo local uma vez (índice único)
- **Requer autenticação**: Sim

### GET /places/:placeId/favorites/check
- **Verificação**: Retorna apenas o status de favorito para o usuário autenticado
- **Isolamento**: Cada usuário vê apenas seus próprios favoritos
- **Requer autenticação**: Sim

### GET /users/me/favorites
- **Ordenação**: Locais são ordenados por data de favoritação (mais recentes primeiro)
- **Contagens**: Inclui contagem de relatos e votos para cada local
- **Paginação**: Suporta paginação com limite máximo de 15 itens por página
- **Isolamento**: Retorna apenas os favoritos do usuário autenticado
- **Requer autenticação**: Sim

## Códigos de Erro

- `400`: Dados inválidos na requisição (ex: UUID inválido, parâmetros de paginação inválidos)
- `401`: Não autenticado ou token inválido
- `404`: Local não encontrado
- `500`: Erro interno do servidor

## Segurança

- **Autenticação**: Todos os endpoints requerem token JWT válido
- **Autorização**: Usuários só podem acessar/modificar seus próprios favoritos
- **Validação**: Todos os dados são validados antes do processamento
- **Isolamento**: Cada usuário vê apenas seus próprios favoritos

## Exemplo de Uso Completo

```javascript
// Verificar se local está favoritado
const checkResponse = await fetch('/places/123e4567-e89b-12d3-a456-426614174000/favorites/check', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
const { isFavorite } = await checkResponse.json();

// Adicionar ou remover dos favoritos
const toggleResponse = await fetch('/places/123e4567-e89b-12d3-a456-426614174000/favorites', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
const { isFavorite: newStatus, message } = await toggleResponse.json();

// Listar todos os favoritos
const favoritesResponse = await fetch('/users/me/favorites?page=1&limit=15', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
const { places, pagination } = await favoritesResponse.json();
```

## Integração com Frontend

### Página de Favoritos
A página "Meus Locais Favoritos" (`/favorites`) exibe todos os locais favoritos do usuário, permitindo:
- Visualização rápida dos locais salvos
- Acesso direto aos detalhes de cada local
- Remoção de favoritos diretamente da lista

### Página de Detalhes do Local
Na página de detalhes do local (`/details/:placeId`), o usuário pode:
- Verificar se o local está favoritado
- Adicionar ou remover dos favoritos com um clique

### Perfil do Usuário
No perfil do usuário (`/profile`), é exibida a estatística:
- Total de locais favoritos do usuário

## Banco de Dados

A tabela `favorites` armazena:
- **`id`**: ID serial (chave primária)
- **`user_id`**: UUID do usuário (chave estrangeira)
- **`place_id`**: UUID do local (chave estrangeira)
- **`created_at`**: Data de criação (timestamp)

**Índice único**: `(user_id, place_id)` - garante que um usuário não pode favoritar o mesmo local duas vezes

