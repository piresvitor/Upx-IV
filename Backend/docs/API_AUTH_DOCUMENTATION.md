# Documentação da API de Autenticação

## Visão Geral

A API de autenticação permite que usuários se registrem, façam login e logout no sistema. Utiliza JWT (JSON Web Tokens) para autenticação.

## Endpoints

### 1. Registrar Usuário

**POST** `/auth/register`

Cria uma nova conta de usuário no sistema.

#### Body:
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

#### Resposta de Sucesso (201):
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "role": "user"
  },
  "message": "Usuário criado com sucesso"
}
```

#### Resposta de Erro (400):
```json
{
  "error": "Email já está em uso"
}
```

### 2. Login

**POST** `/auth/login`

Autentica um usuário e retorna um token JWT.

#### Body:
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

#### Resposta de Sucesso (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "role": "user"
  },
  "message": "Login realizado com sucesso"
}
```

#### Resposta de Erro (401):
```json
{
  "error": "Credenciais inválidas"
}
```

### 3. Logout

**POST** `/auth/logout`

Realiza logout do usuário (requer autenticação).

#### Headers:
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### Resposta de Sucesso (200):
```json
{
  "message": "Logout realizado com sucesso"
}
```

#### Resposta de Erro (401):
```json
{
  "error": "Token inválido ou expirado"
}
```

## Fluxo de Autenticação

1. **Registro**: Usuário cria conta com nome, email e senha
2. **Login**: Usuário fornece email e senha, recebe token JWT
3. **Uso da API**: Token é enviado no header `Authorization: Bearer <token>`
4. **Logout**: Token é invalidado (opcional, dependendo da implementação)

## Segurança

- **Senhas**: São hasheadas usando Argon2 antes de serem armazenadas
- **Tokens JWT**: Contêm informações do usuário e expiram automaticamente
- **Validação**: Todos os campos são validados antes do processamento

## Códigos de Erro

- `400`: Dados inválidos na requisição
- `401`: Não autenticado ou credenciais inválidas
- `409`: Email já está em uso (apenas para registro)
- `500`: Erro interno do servidor
