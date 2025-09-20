// Arquivo de teste para CORS
// Execute este arquivo com: node testcors.js

const API_BASE_URL = 'http://localhost:3333'

// Função para testar uma requisição
async function testRequest(url, options = {}) {
    try {
        console.log(`\n🔍 Testando: ${options.method || 'GET'} ${url}`)
        console.log('📤 Headers enviados:', options.headers || {})
        
        const response = await fetch(url, {
            ...options,
            credentials: 'include', // Para incluir cookies
        })
        
        console.log(`📥 Status: ${response.status} ${response.statusText}`)
        console.log('📥 Headers recebidos:', Object.fromEntries(response.headers.entries()))
        
        if (response.ok) {
            // Para requisições OPTIONS, não tentar fazer parse do JSON
            if (response.status === 204 || options.method === 'OPTIONS') {
                console.log('✅ Resposta OPTIONS (Preflight) - CORS configurado corretamente!')
            } else {
                const data = await response.json()
                console.log('✅ Resposta:', JSON.stringify(data, null, 2))
            }
        } else {
            const errorText = await response.text()
            console.log('❌ Erro:', errorText)
        }
        
        return response
    } catch (error) {
        console.log('Erro na requisição:', error.message)
        return null
    }
}

// Função principal de teste
async function runTests() {
    console.log(' Iniciando testes de CORS...')
    console.log('=' .repeat(50))
    
    // Teste 1: Ping (GET simples)
    await testRequest(`${API_BASE_URL}/ping`)
    
    // Teste 2: Login (POST com CORS)
    await testRequest(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'teste@exemplo.com',
            password: 'senha123'
        })
    })
    
    // Teste 3: Register (POST com CORS)
    await testRequest(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Usuário Teste',
            email: 'teste.cors@exemplo.com',
            password: 'senha123'
        })
    })
    
    // Teste 4: Stats (GET com CORS)
    await testRequest(`${API_BASE_URL}/stats/general`)
    
    // Teste 5: OPTIONS preflight
    await testRequest(`${API_BASE_URL}/auth/login`, {
        method: 'OPTIONS',
        headers: {
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
    })
    
    console.log('\n' + '=' .repeat(50))
    console.log('Testes de CORS concluídos!')

}

// Executar testes
runTests().catch(console.error)
