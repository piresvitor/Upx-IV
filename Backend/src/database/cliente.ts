import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema.ts"

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Teste de conexão
pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL')
})

pool.on('error', (err) => {
  console.error('Erro no pool de conexões:', err)
})

export const db = drizzle(pool, { schema })
