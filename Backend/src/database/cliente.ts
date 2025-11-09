import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema.ts"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Teste de conexão
pool.on('connect', () => {
  // Conexão estabelecida
})

pool.on('error', (err) => {
  console.error('Erro no pool de conexões:', err)
})

export const db = drizzle(pool, { schema })
