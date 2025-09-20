# 🌐 Instruções para Testar CORS

## 🚀 Como Testar o CORS

### Opção 1: Servidor HTTP (Recomendado)
```bash
# 1. Inicie o servidor para servir o arquivo HTML
npm run serve:cors

# 2. Abra o navegador e acesse:
http://localhost:3000
```

### Opção 2: Teste via Node.js
```bash
# Execute o teste via linha de comando
npm run test:cors
```

## 🔧 Por que usar o servidor HTTP?

O erro "Failed to fetch" ocorre quando você abre o arquivo `testcors.html` diretamente no navegador (file://). Isso acontece porque:

1. **Política de Same-Origin**: Navegadores bloqueiam requisições de `file://` para `http://`
2. **CORS**: Requer que ambos os recursos (frontend e backend) sejam servidos via HTTP/HTTPS

## 📋 Status dos Serviços

| Serviço | Porta | Status | URL |
|---------|-------|--------|-----|
| **Backend API** | 3333 | ✅ Rodando | http://localhost:3333 |
| **Servidor HTML** | 3000 | ✅ Rodando | http://localhost:3000 |

## 🧪 Testes Disponíveis

### No Navegador (http://localhost:3000):
- ✅ Ping (GET)
- ✅ Estatísticas (GET) 
- ✅ Registro (POST)
- ✅ Login (POST)
- ✅ Preflight (OPTIONS)

### Via Node.js (npm run test:cors):
- ✅ Ping (GET)
- ✅ Estatísticas (GET)
- ✅ Registro (POST)
- ✅ Login (POST)
- ✅ Preflight (OPTIONS)

## 🎯 Próximos Passos

1. **Abra http://localhost:3000 no navegador**
2. **Clique nos botões de teste**
3. **Verifique se todos os testes passam**
4. **Desenvolva seu frontend** usando a API em http://localhost:3333

## 🔍 Solução de Problemas

### Erro: "Failed to fetch"
- ✅ **Solução**: Use `http://localhost:3000` em vez de abrir o arquivo diretamente

### Erro: "Connection refused"
- Verifique se o backend está rodando: `npm run dev`
- Verifique se o servidor HTML está rodando: `npm run serve:cors`

### Erro: "CORS policy"
- ✅ **Já resolvido**: CORS está configurado corretamente no backend
