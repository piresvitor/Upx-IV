import { db } from './cliente'
import { users } from './schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { hash } from 'argon2'

async function seedUser() {
  try {
    console.log('Iniciando o processo de seed do banco de dados...')

    // Limpa a tabela de usuários antes de adicionar novos dados
    console.log('Limpando a tabela de usuários...')
    await db.delete(users)

    // Gera 10 usuários fictícios
    const usersToInsert = Array.from({ length: 10 }).map(() => {
      return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: 'user', 
        passwordHash: 'placeholder', 
      }
    })

    // Adiciona o hash da senha 
    for (const user of usersToInsert) {
      user.passwordHash = await hash('123456') // HASH da senha para todos os usuários
    }

    // Insere todos os usuários na tabela
    console.log('Inserindo 10 novos usuários...')
    await db.insert(users).values(usersToInsert)

    console.log('Seed concluído com sucesso!')
  } catch (error) {
    console.error('Erro durante o seed:', error)
    process.exit(1)
  } finally {
    console.log('Fechando a conexão com o banco de dados.')
    process.exit(0)
  }
}

async function seed() {
  await seedUser()
}

seed()
