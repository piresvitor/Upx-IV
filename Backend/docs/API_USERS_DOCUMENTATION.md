# Documentação da API de Usuários

## Visão Geral

A API de usuários permite gerenciar informações do perfil do usuário autenticado, incluindo visualização, atualização e exclusão da conta.

## Endpoints

### 1. Obter Dados do Usuário

**GET** `/users/me`

Retorna os dados do usuário autenticado.

#### Headers:
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Resposta de Sucesso (200):
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "role": "user"
  }
}
```

#### Resposta de Erro (401):
```json
{
  "error": "Token inválido ou expirado"
}
```

### 2. Atualizar Dados do Usuário

**PUT** `/users/me`

Atualiza os dados do usuário autenticado.

#### Headers:
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Body:
```json
{
  "name": "Novo Nome do Usuário",
  "email": "novoemail@exemplo.com"
}
```

#### Resposta de Sucesso (200):
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "name": "Novo Nome do Usuário",
    "email": "novoemail@exemplo.com",
    "role": "user"
  },
  "message": "Usuário atualizado com sucesso"
}
```

#### Resposta de Erro (400):
```json
{
  "error": "Email já está em uso"
}
```

#### Resposta de Erro (401):
```json
{
  "error": "Token inválido ou expirado"
}
```

### 3. Excluir Conta do Usuário

**DELETE** `/users/me`

Exclui permanentemente a conta do usuário autenticado.

#### Headers:
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Resposta de Sucesso (200):
```json
{
  "message": "Usuário excluído com sucesso"
}
```

#### Resposta de Erro (401):
```json
{
  "error": "Token inválido ou expirado"
}
```

## Validações

### Campos Obrigatórios
- **name**: String com 1-100 caracteres
- **email**: Email válido e único no sistema

### Campos Opcionais
- Todos os campos podem ser omitidos na atualização (apenas os fornecidos serão atualizados)

## Comportamento dos Endpoints

### GET /users/me
- Retorna apenas os dados básicos do usuário
- Não expõe informações sensíveis como hash da senha
- Requer autenticação válida

### PUT /users/me
- Permite atualização parcial dos dados
- Valida unicidade do email se fornecido
- Mantém o ID e role do usuário inalterados
- Requer autenticação válida

### DELETE /users/me
- Remove permanentemente a conta do usuário
- Pode ter efeitos em cascata (relatos, votos, etc.)
- Requer autenticação válida
- **Ação irreversível**

### 4. Buscar Todos os Usuários

**GET** `/users`

Busca todos os usuários com filtros e paginação. Requer autenticação.

#### Headers:
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Parâmetros de Query:
- `page` (number, opcional): Página (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 10, máximo: 50)
- `search` (string, opcional): Termo de busca (nome ou email)
- `role` (string, opcional): Filtrar por role ("user" ou "admin")
- `sortBy` (string, opcional): Campo para ordenação ("name", "email", padrão: "name")
- `sortOrder` (string, opcional): Ordem da classificação ("asc", "desc", padrão: "desc")

#### Exemplo de Requisição:
```http
GET /users?page=1&limit=5&search=João&role=user&sortBy=name&sortOrder=asc
```

#### Resposta de Sucesso (200):
```json
{
  "users": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "user"
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

#### Resposta de Erro (401):
```json
{
  "error": "Token inválido ou expirado"
}
```

#### Resposta de Erro (400):
```json
{
  "error": "Parâmetros de paginação inválidos"
}
```

### GET /users
- Busca todos os usuários com filtros e paginação
- Suporta busca por nome ou email
- Suporta filtro por role
- Suporta ordenação por nome e email
- Requer autenticação válida
- Limite máximo de 50 itens por página

## Códigos de Erro

- `400`: Dados inválidos na requisição
- `401`: Não autenticado ou token inválido
- `409`: Email já está em uso (apenas para atualização)
- `500`: Erro interno do servidor

## Segurança

- **Autenticação**: Todos os endpoints requerem token JWT válido
- **Autorização**: Usuários só podem acessar/modificar seus próprios dados
- **Validação**: Todos os dados são validados antes do processamento
- **Sanitização**: Dados são sanitizados para prevenir ataques

## Exemplo de Uso

```javascript
// Obter dados do usuário
const response = await fetch('/users/me', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

// Atualizar dados do usuário
const updateResponse = await fetch('/users/me', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Novo Nome'
  })
});
```
