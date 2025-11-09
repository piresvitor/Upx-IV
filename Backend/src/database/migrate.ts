import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync } from 'fs'
import { join } from 'path'

const execAsync = promisify(exec)

export async function runMigrations(): Promise<void> {
  try {
    console.log('🔍 Verificando migrações do banco de dados...')
    
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️ DATABASE_URL não configurada, pulando migrações...')
      return
    }
    
    // Verificar se a pasta de migrações existe
    const migrationsDir = join(process.cwd(), 'drizzle')
    if (!existsSync(migrationsDir)) {
      console.warn('⚠️ Pasta de migrações não encontrada, pulando migrações...')
      return
    }
    
    console.log('🚀 Executando migrações do banco de dados...')
    
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
    
    console.log('✅ Migrações verificadas/executadas com sucesso!')
  } catch (error: any) {
    // Se o erro for sobre "No migrations to run", não é um erro crítico
    if (error.stderr && (error.stderr.includes('No migrations to run') || error.stderr.includes('No pending migrations'))) {
      console.log('ℹ️ Nenhuma migração pendente, continuando...')
      return
    }
    
    // Para outros erros, apenas logar mas não falhar o servidor
    console.error('⚠️ Erro ao executar migrações (continuando mesmo assim):')
    console.error('Mensagem:', error.message)
    
    if (error.stdout) {
      console.error('📋 Stdout:', error.stdout)
    }
    if (error.stderr) {
      console.error('⚠️ Stderr:', error.stderr)
    }
  }
}

