# 🌐 Configuração CORS - Mapa Colaborativo

## 📋 Visão Geral

O CORS (Cross-Origin Resource Sharing) foi configurado no backend para permitir que o frontend acesse a API de diferentes origens.

## ⚙️ Configuração Atual

### Arquivo: `src/app.ts`

```typescript
// Configurar CORS manualmente
server.addHook('onRequest', async (request, reply) => {
    // Obter a origem da requisição
    const origin = request.headers.origin || request.headers.host
    
    // Headers CORS para todas as requisições
    reply.header('Access-Control-Allow-Origin', origin || '*')
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers')
    reply.header('Access-Control-Allow-Credentials', 'true')
    reply.header('Access-Control-Expose-Headers', 'Content-Length, X-Foo, X-Bar')
    
    // Lidar com requisições OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
        reply.code(204)
        return reply.send()
    }
})
```

## 🔧 Configurações Explicadas

| Configuração | Valor | Descrição |
|--------------|-------|-----------|
| `Access-Control-Allow-Origin: origin` | Origem específica | Retorna a origem exata da requisição (necessário com credentials) |
| `Access-Control-Allow-Credentials: true` | Permite cookies/headers | Permite envio de cookies e headers de autenticação |
| `Access-Control-Allow-Methods` | GET, POST, PUT, DELETE, OPTIONS | Define quais métodos HTTP são permitidos |
| `Access-Control-Allow-Headers` | Headers permitidos | Define quais headers podem ser enviados |
| `OPTIONS → 204` | Status 204 para preflight | Resposta correta para requisições OPTIONS |

## 🧪 Testando o CORS

### 1. Teste via Node.js
```bash
node testcors.js
```

### 2. Teste via Navegador
Abra o arquivo `testcors.html` no navegador e clique nos botões de teste.

### 3. Teste Manual via Console do Navegador
```javascript
// Teste básico
fetch('http://localhost:3333/ping', {
    credentials: 'include'
})
.then(response => response.json())
.then(data => console.log('✅ CORS funcionando:', data))
.catch(error => console.log('❌ Erro CORS:', error));
```

## 📡 Headers CORS Retornados

Quando o CORS está funcionando, você verá estes headers nas respostas:

```
access-control-allow-credentials: true
access-control-allow-origin: http://localhost:3000 (ou a origem da requisição)
vary: Origin
```

## 🚀 Exemplo de Uso no Frontend

### React/Vue/Angular
```javascript
// Exemplo de requisição do frontend
const response = await fetch('http://localhost:3333/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer seu-token'
    },
    credentials: 'include', // Importante para CORS
    body: JSON.stringify({
        email: 'usuario@exemplo.com',
        password: 'senha123'
    })
});

const data = await response.json();
```

### Axios
```javascript
import axios from 'axios';

// Configurar axios para usar CORS
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3333';

// Exemplo de uso
const response = await axios.post('/auth/login', {
    email: 'usuario@exemplo.com',
    password: 'senha123'
});
```

## 🔒 Configuração para Produção

Para produção, você deve restringir as origens permitidas:

```typescript
server.register(cors, {
    origin: [
        'https://seu-frontend.com',
        'https://www.seu-frontend.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})
```

## 🐛 Solução de Problemas

### Erro: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Causa:** CORS não configurado ou configuração incorreta.

**Solução:**
1. Verifique se o servidor está rodando
2. Confirme se o CORS está configurado no `src/app.ts`
3. Teste com `testcors.js` ou `testcors.html`

### Erro: "Invalid Preflight Request" (Status 400)

**Causa:** Requisições OPTIONS não estão sendo tratadas corretamente.

**Solução Implementada:**
- Removemos o plugin `@fastify/cors` que estava causando conflitos
- Implementamos CORS manualmente usando hooks do Fastify
- Adicionamos tratamento específico para requisições OPTIONS (preflight)
- Retornamos status 204 para requisições OPTIONS bem-sucedidas

### Erro: "Access-Control-Allow-Origin header must not be wildcard when credentials mode is 'include'"

**Causa:** Quando usamos `credentials: 'include'`, o navegador não permite `Access-Control-Allow-Origin: *`.

**Solução Implementada:**
- Modificamos o CORS para retornar a origem específica da requisição
- Usamos `request.headers.origin` para obter a origem exata
- Fallback para `*` apenas quando não há origem (requisições diretas)

### Erro: "Preflight request doesn't pass access control check"

**Causa:** Requisição OPTIONS (preflight) não está sendo tratada.

**Solução:**
1. Certifique-se de que `OPTIONS` está na lista de métodos permitidos
2. Verifique se os headers necessários estão em `allowedHeaders`

### Erro: "Credentials flag is true, but the 'Access-Control-Allow-Credentials' header is not set"

**Causa:** `credentials: 'include'` está sendo usado, mas o servidor não permite credenciais.

**Solução:**
1. Configure `credentials: true` no servidor
2. Ou remova `credentials: 'include'` do frontend

## 📚 Recursos Adicionais

- [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Fastify CORS Plugin](https://github.com/fastify/fastify-cors)
- [CORS Tester](https://www.test-cors.org/)

## ✅ Checklist de Verificação

- [ ] CORS instalado (`npm install @fastify/cors`)
- [ ] CORS registrado no `src/app.ts`
- [ ] Servidor reiniciado após configuração
- [ ] Teste via `testcors.js` passou
- [ ] Teste via `testcors.html` passou
- [ ] Frontend consegue fazer requisições
- [ ] Headers CORS aparecem nas respostas
