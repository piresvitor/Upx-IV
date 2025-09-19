# Documentação da API de Locais

## Visão Geral

A API de locais permite integrar com o Google Maps para buscar locais próximos, verificar se um local já existe no sistema, e gerenciar relatos específicos de locais.

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

### 3. Criar Relato para um Local

**POST** `/places/:placeId/reports`

Cria um relato específico para um local. Requer autenticação.

#### Parâmetros:
- `placeId` (string, obrigatório): UUID do local no banco (não o place_id do Google)

#### Body:
```json
{
  "title": "Título do relato",
  "description": "Descrição detalhada do relato",
  "type": "acessibilidade" // Tipo do relato
}
```

#### Resposta:
```json
{
  "report": {
    "id": "uuid-do-relato",
    "title": "Título do relato",
    "description": "Descrição detalhada",
    "type": "acessibilidade",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "userId": "uuid-do-usuario",
    "placeId": "uuid-do-local"
  },
  "message": "Relato criado com sucesso"
}
```

### 4. Buscar Relatos de um Local

**GET** `/places/:placeId/reports`

Busca todos os relatos de um local específico com paginação.

#### Parâmetros:
- `placeId` (string, obrigatório): UUID do local no banco

#### Query Parameters:
- `page` (number, opcional): Página (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 10)

#### Exemplo:
```http
GET /places/uuid-do-local/reports?page=1&limit=5
```

#### Resposta:
```json
{
  "reports": [
    {
      "id": "uuid-do-relato",
      "title": "Título do relato",
      "description": "Descrição",
      "type": "acessibilidade",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "uuid-do-usuario",
        "name": "Nome do Usuário"
      },
      "votesCount": 5,
      "userVoted": false // true se o usuário autenticado votou neste relato
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## Fluxo de Uso Recomendado

1. **Buscar locais próximos**: Use `/places/search-nearby` para mostrar locais no mapa
2. **Usuário clica em um local**: Use `/places/check-or-create` para verificar se o local existe
3. **Se o local existe**: Mostre a página do local com os relatos existentes
4. **Se o local não existe**: O sistema cria automaticamente e você pode mostrar a página vazia
5. **Usuário cria relato**: Use `/places/:placeId/reports` para criar um novo relato
6. **Visualizar relatos**: Use `/places/:placeId/reports` para listar todos os relatos

## Códigos de Erro

- `400`: Dados inválidos na requisição
- `401`: Não autenticado (para endpoints que requerem autenticação)
- `404`: Local não encontrado
- `500`: Erro interno do servidor

## Configuração Necessária

Certifique-se de que a variável de ambiente `GOOGLE_MAPS_API_KEY` está configurada com uma chave válida da API do Google Maps.
