import { exec } from 'child_process'
import { promisify } from 'util'
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { join } from 'path'

dotenv.config()

const execAsync = promisify(exec)

async function runMigrations() {
  try {
    console.log('🔍 Verificando configuração...')
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não está configurada')
    }
    
    console.log('✅ DATABASE_URL configurada')
    
    // Verificar se a pasta de migrações existe
    const migrationsDir = join(process.cwd(), 'drizzle')
    if (!existsSync(migrationsDir)) {
      console.warn('⚠️ Pasta de migrações não encontrada, pulando migrações...')
      process.exit(0)
    }
    
    console.log('🚀 Executando migrações do banco de dados...')
    console.log('📁 Diretório de migrações:', migrationsDir)
    
    // Executar migrações com timeout de 60 segundos
    const { stdout, stderr } = await execAsync('npx drizzle-kit migrate', {
      timeout: 60000,
      env: process.env
    })
    
    if (stdout) {
      console.log('📋 Saída do comando:')
      console.log(stdout)
    }
    
    if (stderr) {
      // Ignorar avisos sobre "No migrations to run" que são normais
      if (!stderr.includes('No migrations to run') && !stderr.includes('No pending migrations')) {
        console.warn('⚠️ Avisos durante migração:')
        console.warn(stderr)
      } else {
        console.log('ℹ️ Nenhuma migração pendente')
      }
    }
    
    console.log('✅ Migrações executadas com sucesso!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Erro ao executar migrações:')
    console.error('Mensagem:', error.message)
    
    if (error.stdout) {
      console.error('📋 Stdout:', error.stdout)
    }
    if (error.stderr) {
      console.error('⚠️ Stderr:', error.stderr)
    }
    
    // Se o erro for sobre "No migrations to run", não é um erro crítico
    if (error.stderr && (error.stderr.includes('No migrations to run') || error.stderr.includes('No pending migrations'))) {
      console.log('ℹ️ Nenhuma migração pendente, continuando...')
      process.exit(0)
    }
    
    // Para outros erros, falhar o build
    console.error('❌ Falha ao executar migrações, abortando build')
    process.exit(1)
  }
}

runMigrations()

