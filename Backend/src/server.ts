import dotenv from 'dotenv'
import {server} from './app.ts'

dotenv.config()

const PORT = process.env.PORT || 3333

console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'Não configurado')
console.log('PORT:', PORT)

server.listen({port: Number(PORT), host: '0.0.0.0'}).then(() =>{
    console.log(`HTTP server running on port ${PORT}!`)
}).catch((error) => {
    console.error('Error starting server:', error)
    process.exit(1)
})