# Documentação da API de Locais

## Visão Geral

A API de locais permite integrar com o Google Maps para buscar locais próximos e verificar se um local já existe no sistema.

## Endpoints

### 1. Buscar Locais Próximos

**GET** `/places/search-nearby`

Busca locais próximos a uma localização específica usando a API do Google Maps.

#### Parâmetros de Query:
- `latitude` (number, obrigatório): Latitude da localização (-90 a 90)
- `longitude` (number, obrigatório): Longitude da localização (-180 a 180)
- `radius` (number, opcional): Raio de busca em metros (padrão: 1000, máximo: 50000)
- `type` (string, opcional): Tipo de local (ex: "restaurant", "hospital", "school")
- `keyword` (string, opcional): Palavra-chave para busca

#### Exemplo de Requisição:
```http
GET /places/search-nearby?latitude=-23.5505&longitude=-46.6333&radius=2000&type=restaurant
```

#### Resposta:
```json
{
  "places": [
    {
      "id": "uuid-do-local-no-banco",
      "placeId": "ChIJ...", // Place ID do Google Maps
      "name": "Nome do Restaurante",
      "address": "Endereço completo",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "types": ["restaurant", "food", "establishment"],
      "rating": 4.5,
      "userRatingsTotal": 150,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "googlePlaces": [
    // Dados brutos do Google Maps
  ]
}
```

### 2. Verificar ou Criar Local

**POST** `/places/check-or-create`

Verifica se um local existe no sistema pelo place_id do Google Maps. Se não existir, cria automaticamente.

#### Body:
```json
{
  "placeId": "ChIJ..." // Place ID do Google Maps
}
```

#### Resposta:
```json
{
  "exists": true, // true se já existia, false se foi criado
  "place": {
    "id": "uuid-do-local",
    "placeId": "ChIJ...",
    "name": "Nome do Local",
    "address": "Endereço",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "types": ["restaurant"],
    "rating": 4.5,
    "userRatingsTotal": 150,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Local já existe no sistema" // ou "Local criado com sucesso no sistema"
}
```

### 3. Obter Detalhes de um Local

**GET** `/places/:placeId`

Obtém detalhes de um local específico pelo ID interno do banco de dados.

#### Parâmetros:
- `placeId` (string, obrigatório): UUID do local no banco de dados

#### Exemplo de Requisição:
```http
GET /places/123e4567-e89b-12d3-a456-426614174000
```

#### Resposta:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "placeId": "ChIJ...",
  "name": "Nome do Local",
  "address": "Endereço completo",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "types": ["restaurant", "food"],
  "rating": 4.5,
  "userRatingsTotal": 150,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Atualizar um Local

**PUT** `/places/:placeId`

Atualiza informações de um local específico.

#### Parâmetros:
- `placeId` (string, obrigatório): UUID do local no banco de dados

#### Body (todos os campos são opcionais):
```json
{
  "name": "Novo Nome do Local",
  "address": "Novo Endereço",
  "types": ["restaurant", "food"],
  "rating": 4.8,
  "userRatingsTotal": 200
}
```

#### Resposta:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "placeId": "ChIJ...",
  "name": "Novo Nome do Local",
  "address": "Novo Endereço",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "types": ["restaurant", "food"],
  "rating": 4.8,
  "userRatingsTotal": 200,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

### 5. Estatísticas de Acessibilidade de um Local

**GET** `/places/:placeId/accessibility-stats`

Calcula estatísticas de acessibilidade para um local específico baseado nos relatos existentes.

#### Parâmetros:
- `placeId` (string, obrigatório): UUID do local no banco de dados

#### Exemplo de Requisição:
```http
GET /places/123e4567-e89b-12d3-a456-426614174000/accessibility-stats
```

#### Resposta:
```json
{
  "place": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Shopping Iguatemi Sorocaba",
    "address": "Rod. Sen. José Ermírio de Moraes, 1425 - Alto da Boa Vista, Sorocaba - SP, Brasil"
  },
  "totalReports": 3,
  "accessibilityStats": {
    "rampaAcesso": {
      "percentage": 100.0,
      "hasMajority": true,
      "positiveCount": 3,
      "totalCount": 3
    },
    "banheiroAcessivel": {
      "percentage": 66.67,
      "hasMajority": true,
      "positiveCount": 2,
      "totalCount": 3
    },
    "estacionamentoAcessivel": {
      "percentage": 100.0,
      "hasMajority": true,
      "positiveCount": 3,
      "totalCount": 3
    },
    "acessibilidadeVisual": {
      "percentage": 33.33,
      "hasMajority": false,
      "positiveCount": 1,
      "totalCount": 3
    }
  }
}
```

#### Explicação dos Campos:
- **`percentage`**: Percentual de relatos positivos (0-100)
- **`hasMajority`**: `true` se > 50% dos relatos são positivos, `false` se ≤ 50%
- **`positiveCount`**: Quantidade de relatos com valor `true`
- **`totalCount`**: Total de relatos analisados

### 6. Buscar Locais com Comentários

**GET** `/places/with-reports`

Busca todos os locais que possuem pelo menos um comentário (relato), com contagem de comentários e votos. Ideal para a página de "Locais" que lista apenas locais com interação.

#### Parâmetros de Query:
- `page` (number, opcional): Página (padrão: 1, mínimo: 1)
- `limit` (number, opcional): Itens por página (padrão: 15, mínimo: 1, máximo: 15)
- `search` (string, opcional): Termo de busca (busca em nome e endereço)
- `type` (string, opcional): Filtrar por tipo de local (ex: "restaurant", "hospital", "school")
- `sortBy` (string, opcional): Campo para ordenação ("reportsCount", "votesCount", "createdAt", padrão: "createdAt")
- `sortOrder` (string, opcional): Ordem da classificação ("asc", "desc", padrão: "desc")

#### Exemplo de Requisição:
```http
GET /places/with-reports?page=1&limit=15&search=restaurante&type=restaurant&sortBy=reportsCount&sortOrder=desc
```

#### Resposta:
```json
{
  "places": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "placeId": "ChIJ...",
      "name": "Restaurante Exemplo",
      "address": "Rua Exemplo, 123",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "types": ["restaurant", "food"],
      "rating": 4.8,
      "userRatingsTotal": 200,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "reportsCount": 5,
      "votesCount": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 15,
    "total": 25,
    "totalPages": 2
  }
}
```

**Nota**: Esta rota retorna apenas locais que possuem pelo menos um relato (comentário). Para buscar todos os locais, use `/places`.

### 7. Buscar Todos os Locais

**GET** `/places`

Busca todos os locais com filtros e paginação.

#### Parâmetros de Query:
- `page` (number, opcional): Página (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 10)
- `search` (string, opcional): Termo de busca (nome ou endereço)
- `type` (string, opcional): Filtrar por tipo de local
- `sortBy` (string, opcional): Campo para ordenação ("name", "rating", "createdAt", padrão: "createdAt")
- `sortOrder` (string, opcional): Ordem da classificação ("asc", "desc", padrão: "desc")

#### Exemplo de Requisição:
```http
GET /places?page=1&limit=5&search=restaurante&type=restaurant&sortBy=rating&sortOrder=desc
```

#### Resposta:
```json
{
  "places": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "placeId": "ChIJ...",
      "name": "Restaurante Exemplo",
      "address": "Rua Exemplo, 123",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "types": ["restaurant", "food"],
      "rating": 4.8,
      "userRatingsTotal": 200,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "totalPages": 5
  }
}
```


## Fluxo de Uso Recomendado

1. **Buscar locais próximos**: Use `/places/search-nearby` para mostrar locais no mapa
2. **Usuário clica em um local**: Use `/places/check-or-create` para verificar se o local existe
3. **Se o local existe**: Mostre a página do local com os relatos existentes
4. **Se o local não existe**: O sistema cria automaticamente e você pode mostrar a página vazia
5. **Para gerenciar relatos**: Use as rotas da API de Relatos (`/reports/`)
6. **Para estatísticas de acessibilidade**: Use `/places/:placeId/accessibility-stats` para dashboards e análises
7. **Para favoritar locais**: Use as rotas da API de Favoritos (`/places/:placeId/favorites`) - veja [API_FAVORITES_DOCUMENTATION.md](./API_FAVORITES_DOCUMENTATION.md)

## Códigos de Erro

- `400`: Dados inválidos na requisição
- `401`: Não autenticado (para endpoints que requerem autenticação)
- `404`: Local não encontrado
- `500`: Erro interno do servidor

## Configuração Necessária

Certifique-se de que a variável de ambiente `GOOGLE_MAPS_API_KEY` está configurada com uma chave válida da API do Google Maps.
