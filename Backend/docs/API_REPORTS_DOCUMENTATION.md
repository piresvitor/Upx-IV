# API Relatos - Documentação

Esta documentação descreve as rotas relacionadas aos relatos de acessibilidade no sistema.

## Base URL
```
http://localhost:3333
```

## Autenticação
Algumas rotas requerem autenticação via JWT token no header:
```
Authorization: Bearer <token>
```

---

## Rotas de Relatos

### 1. Criar Relato

**POST** `/places/:placeId/reports`

Cria um novo relato para um local específico.

#### Parâmetros da URL
- `placeId` (string, UUID): ID do local para o qual o relato será criado

#### Headers
- `Authorization`: Bearer token (obrigatório)

#### Body
```json
{
  "title": "Título do relato",
  "description": "Descrição detalhada do relato",
  "type": "Tipo do relato (ex: accessibility, safety, etc.)",
  "rampaAcesso": true,
  "banheiroAcessivel": false,
  "estacionamentoAcessivel": true,
  "acessibilidadeVisual": false
}
```

**Campos de Acessibilidade (opcionais, default: false):**
- `rampaAcesso` (boolean): Indica se o local possui rampa de acesso
- `banheiroAcessivel` (boolean): Indica se há banheiro adaptado para cadeirantes
- `estacionamentoAcessivel` (boolean): Indica se há vagas especiais para PCD
- `acessibilidadeVisual` (boolean): Indica se há recursos para deficientes visuais

#### Respostas

**201 - Relato criado com sucesso**
```json
{
  "report": {
    "id": "uuid",
    "title": "Título do relato",
    "description": "Descrição detalhada do relato",
    "type": "Tipo do relato",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "userId": "uuid",
    "placeId": "uuid",
    "rampaAcesso": true,
    "banheiroAcessivel": false,
    "estacionamentoAcessivel": true,
    "acessibilidadeVisual": false
  },
  "message": "Relato criado com sucesso"
}
```

**400 - Dados inválidos**
```json
{
  "error": "Mensagem de erro de validação"
}
```

**401 - Não autorizado**
```json
{
  "error": "Token de autorização não fornecido"
}
```

**404 - Local não encontrado**
```json
{
  "error": "Local não encontrado"
}
```

**500 - Erro interno**
```json
{
  "error": "Erro interno do servidor"
}
```

---

### 2. Buscar Relatos de um Local

**GET** `/places/:placeId/reports`

Busca todos os relatos de um local específico com paginação.

#### Parâmetros da URL
- `placeId` (string, UUID): ID do local

#### Query Parameters
- `page` (number, opcional): Número da página (padrão: 1)
- `limit` (number, opcional): Itens por página, 1-50 (padrão: 10)

#### Headers
- Nenhum (público)

#### Respostas

**200 - Sucesso**
```json
{
  "place": {
    "id": "uuid",
    "placeId": "google_place_id",
    "name": "Nome do Local",
    "address": "Endereço",
    "latitude": -23.0,
    "longitude": -46.0,
    "types": ["restaurant"],
    "rating": 4.2,
    "userRatingsTotal": 10,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "reports": [
    {
      "id": "uuid",
      "title": "Título do relato",
      "description": "Descrição do relato",
      "type": "Tipo do relato",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "uuid",
        "name": "Nome do usuário",
        "email": "email@exemplo.com"
      },
      "rampaAcesso": true,
      "banheiroAcessivel": false,
      "estacionamentoAcessivel": true,
      "acessibilidadeVisual": false
    }
  ]
  ,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**404 - Local não encontrado**
```json
{
  "error": "Local não encontrado"
}
```

**500 - Erro interno**
```json
{
  "error": "Erro interno do servidor"
}
```

---

### 3. Listar Relatos (geral, com filtros)

**GET** `/reports`

Lista relatos com filtros opcionais e paginação.

#### Query Parameters
- `type` (string, opcional): Filtra por tipo de relato (ex: accessibility, safety)
- `user_id` (UUID, opcional): Filtra por autor
- `page` (number, opcional): Número da página (padrão: 1)
- `limit` (number, opcional): Itens por página, 1-50 (padrão: 10)

#### Respostas

**200 - Sucesso**
```json
{
  "reports": [
    {
      "id": "uuid",
      "title": "Título",
      "description": "Descrição",
      "type": "accessibility",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": { "id": "uuid", "name": "Nome", "email": "email@x.com" },
      "place": { "id": "uuid", "name": "Lugar" },
      "rampaAcesso": true,
      "banheiroAcessivel": false,
      "estacionamentoAcessivel": true,
      "acessibilidadeVisual": false
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

---

### 4. Obter um Relato

**GET** `/reports/:reportId`

Retorna um relato específico.

#### Parâmetros da URL
- `reportId` (UUID): ID do relato

#### Respostas

**200 - Sucesso**
```json
{
  "id": "uuid",
  "title": "Título",
  "description": "Descrição",
  "type": "accessibility",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "user": { "id": "uuid", "name": "Nome", "email": "email@x.com" },
  "place": { "id": "uuid", "name": "Lugar" },
  "rampaAcesso": true,
  "banheiroAcessivel": false,
  "estacionamentoAcessivel": true,
  "acessibilidadeVisual": false
}
```

**404 - Não encontrado**
```json
{ "message": "Relato não encontrado" }
```

---

### 5. Atualizar um Relato (somente autor)

**PUT** `/reports/:reportId`

Atualiza campos do relato; requer autenticação do autor.

#### Headers
- `Authorization`: Bearer token (obrigatório)

#### Body
```json
{
  "title": "Novo título",
  "description": "Nova descrição",
  "type": "accessibility",
  "rampaAcesso": true,
  "banheiroAcessivel": false,
  "estacionamentoAcessivel": true,
  "acessibilidadeVisual": false
}
```

**Campos de Acessibilidade (opcionais):**
- `rampaAcesso` (boolean): Atualiza se o local possui rampa de acesso
- `banheiroAcessivel` (boolean): Atualiza se há banheiro adaptado para cadeirantes
- `estacionamentoAcessivel` (boolean): Atualiza se há vagas especiais para PCD
- `acessibilidadeVisual` (boolean): Atualiza se há recursos para deficientes visuais

#### Respostas
- `200` { "message": "Relato atualizado com sucesso" }
- `403` { "message": "Acesso negado" }
- `404` { "message": "Relato não encontrado" }

---

### 6. Remover um Relato (somente autor)

**DELETE** `/reports/:reportId`

Remove o relato; requer autenticação do autor.

#### Headers
- `Authorization`: Bearer token (obrigatório)

#### Respostas
- `200` { "message": "Relato removido com sucesso" }
- `403` { "message": "Acesso negado" }
- `404` { "message": "Relato não encontrado" }

---

### 7. Votar em um Relato

**POST** `/reports/:reportId/votes`

Cria um voto para um relato específico. Cada usuário pode votar apenas uma vez por relato.

#### Parâmetros da URL
- `reportId` (string, UUID): ID do relato

#### Headers
- `Authorization`: Bearer token (obrigatório)

#### Respostas

**201 - Voto criado com sucesso**
```json
{
  "message": "Voto criado com sucesso",
  "vote": {
    "id": 1,
    "userId": "uuid",
    "reportId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**400 - Dados inválidos**
```json
{
  "message": "Mensagem de erro de validação"
}
```

**401 - Não autorizado**
```json
{
  "message": "Token de autorização não fornecido"
}
```

**404 - Relato não encontrado**
```json
{
  "message": "Relato não encontrado"
}
```

**409 - Voto duplicado**
```json
{
  "message": "Você já votou neste relato"
}
```

---

### 8. Remover Voto de um Relato

**DELETE** `/reports/:reportId/votes`

Remove o voto do usuário autenticado de um relato específico.

#### Parâmetros da URL
- `reportId` (string, UUID): ID do relato

#### Headers
- `Authorization`: Bearer token (obrigatório)

#### Respostas

**200 - Voto removido com sucesso**
```json
{
  "message": "Voto removido com sucesso"
}
```

**401 - Não autorizado**
```json
{
  "message": "Token de autorização não fornecido"
}
```

**404 - Relato ou voto não encontrado**
```json
{
  "message": "Relato não encontrado"
}
```
ou
```json
{
  "message": "Voto não encontrado"
}
```

---

## Exemplos de Uso

### Criar um relato de acessibilidade
```bash
curl -X POST http://localhost:3333/places/123e4567-e89b-12d3-a456-426614174000/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_aqui" \
  -d '{
    "title": "Rampa de acesso quebrada",
    "description": "A rampa de acesso na entrada principal está com o piso solto, representando risco para cadeirantes.",
    "type": "accessibility",
    "rampaAcesso": false,
    "banheiroAcessivel": true,
    "estacionamentoAcessivel": true,
    "acessibilidadeVisual": false
  }'
```

### Buscar relatos de um local
```bash
curl -X GET "http://localhost:3333/places/123e4567-e89b-12d3-a456-426614174000/reports"
```

### Listar relatos filtrando por tipo e usuário
```bash
curl -X GET "http://localhost:3333/reports?type=accessibility&user_id=123e4567-e89b-12d3-a456-426614174000&page=1&limit=10"
```

### Obter um relato específico
```bash
curl -X GET "http://localhost:3333/reports/123e4567-e89b-12d3-a456-426614174000"
```

### Atualizar um relato (autor)
```bash
curl -X PUT "http://localhost:3333/reports/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Novo título",
    "rampaAcesso": true,
    "banheiroAcessivel": true,
    "estacionamentoAcessivel": false,
    "acessibilidadeVisual": true
  }'
```

### Remover um relato (autor)
```bash
curl -X DELETE "http://localhost:3333/reports/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer <token>"
```

### Votar em um relato
```bash
curl -X POST "http://localhost:3333/reports/123e4567-e89b-12d3-a456-426614174000/votes" \
  -H "Authorization: Bearer <token>"
```

### Remover voto de um relato
```bash
curl -X DELETE "http://localhost:3333/reports/123e4567-e89b-12d3-a456-426614174000/votes" \
  -H "Authorization: Bearer <token>"
```

---

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autorizado
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

---

## Notas Importantes

1. **Autenticação**: As rotas de criar relato e votação requerem autenticação obrigatória
2. **Paginação**: A rota de buscar relatos suporta paginação para melhor performance
3. **Validação**: Todos os campos são validados antes do processamento
4. **Tipos de Relato**: O campo `type` pode ser usado para categorizar diferentes tipos de relatos (accessibility, safety, etc.)
5. **Votação**: Cada usuário pode votar apenas uma vez por relato. O sistema previne votos duplicados
6. **Controle de Acesso**: Apenas o autor pode editar ou remover seus próprios relatos
