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
  "type": "Tipo do relato (ex: accessibility, safety, etc.)"
}
```

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
    "placeId": "uuid"
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
      }
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

## Exemplos de Uso

### Criar um relato de acessibilidade
```bash
curl -X POST http://localhost:3333/places/123e4567-e89b-12d3-a456-426614174000/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_aqui" \
  -d '{
    "title": "Rampa de acesso quebrada",
    "description": "A rampa de acesso na entrada principal está com o piso solto, representando risco para cadeirantes.",
    "type": "accessibility"
  }'
```

### Buscar relatos de um local
```bash
curl -X GET "http://localhost:3333/places/123e4567-e89b-12d3-a456-426614174000/reports"
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

1. **Autenticação**: A rota de criar relato requer autenticação obrigatória
2. **Paginação**: A rota de buscar relatos suporta paginação para melhor performance
3. **Votos**: Se o usuário estiver autenticado, a resposta inclui se ele já votou em cada relato
4. **Validação**: Todos os campos são validados antes do processamento
5. **Tipos de Relato**: O campo `type` pode ser usado para categorizar diferentes tipos de relatos (accessibility, safety, etc.)
