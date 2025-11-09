import { exec } from 'child_process'
import { promisify } from 'util'
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { join } from 'path'

dotenv.config()

const execAsync = promisify(exec)

async function runMigrations() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não está configurada')
    }
    
    // Verificar se a pasta de migrações existe
    const migrationsDir = join(process.cwd(), 'drizzle')
    if (!existsSync(migrationsDir)) {
      console.warn('Pasta de migrações não encontrada, pulando migrações...')
      process.exit(0)
    }
    
    // Executar migrações com timeout de 60 segundos
    const { stdout, stderr } = await execAsync('npx drizzle-kit migrate', {
      timeout: 60000,
      env: process.env
    })
    
    if (stderr) {
      // Ignorar avisos sobre "No migrations to run" que são normais
      if (!stderr.includes('No migrations to run') && !stderr.includes('No pending migrations')) {
        console.warn('Avisos durante migração:', stderr)
      }
    }
    
    process.exit(0)
  } catch (error: any) {
    console.error('Erro ao executar migrações:', error.message)
    
    if (error.stderr) {
      console.error('Stderr:', error.stderr)
    }
    
    // Se o erro for sobre "No migrations to run", não é um erro crítico
    if (error.stderr && (error.stderr.includes('No migrations to run') || error.stderr.includes('No pending migrations'))) {
      process.exit(0)
    }
    
    // Para outros erros, falhar o build
    console.error('Falha ao executar migrações, abortando build')
    process.exit(1)
  }
}

runMigrations()

