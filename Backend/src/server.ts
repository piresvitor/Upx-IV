import dotenv from 'dotenv'
import {server} from './app.ts'
import { runMigrations } from './database/migrate.ts'

dotenv.config()

const PORT = process.env.PORT || 3333

// Executar migrações antes de iniciar o servidor
runMigrations().then(() => {
  // Iniciar servidor após as migrações
  server.listen({port: Number(PORT), host: '0.0.0.0'}).then(() =>{
      console.log(`HTTP server running on port ${PORT}!`)
  }).catch((error) => {
      console.error('Error starting server:', error)
      process.exit(1)
  })
}).catch((error) => {
  console.error('Error running migrations:', error)
  // Mesmo com erro nas migrações, tentar iniciar o servidor
  server.listen({port: Number(PORT), host: '0.0.0.0'}).then(() =>{
      console.log(`HTTP server running on port ${PORT}!`)
  }).catch((error) => {
      console.error('Error starting server:', error)
      process.exit(1)
  })
})