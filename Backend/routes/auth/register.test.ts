/*
9 testes implementados:
Registro com dados válidos - Retorna 201 e cria usuário no banco
Email duplicado - Retorna 409 com mensagem de usuário já cadastrado
Nome ausente - Retorna 400 (validação do schema)
Email ausente - Retorna 400 (validação do schema)
Senha ausente - Retorna 400 (validação do schema)
Formato de email inválido - Retorna 400 (validação do schema)
Nome muito curto - Retorna 400 (menos de 3 caracteres)
Senha muito curta - Retorna 400 (menos de 8 caracteres)
Hash da senha - Verifica se a senha foi hasheada corretamente com Argon2
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'
import { eq } from 'drizzle-orm'
import { faker } from '@faker-js/faker'

describe('Register Route', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await db.delete(users)
  })

  test('should register user successfully with valid data', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123'
    }

    const response = await request(server.server)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(userData)

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      message: 'Usuário cadastrado com sucesso'
    })

    // Verificar se o usuário foi criado no banco
    const [createdUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1)

    expect(createdUser).toBeDefined()
    expect(createdUser.name).toBe(userData.name)
    expect(createdUser.email).toBe(userData.email)
    expect(createdUser.role).toBe('user') // Role padrão
  })

  test('should return 409 for duplicate email', async () => {
    const { user } = await makeUser()

    const response = await request(server.server)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        name: faker.person.fullName(),
        email: user.email, // Email já existente
        password: 'password123'
      })

    expect(response.status).toEqual(409)
    expect(response.body).toEqual({
      message: 'Usuário ja cadastrado com esse email'
    })
  })

  test('should return 400 for missing name', async () => {
    const response = await request(server.server)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        email: faker.internet.email(),
        password: 'password123'
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for missing email', async () => {
    const response = await request(server.server)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        name: faker.person.fullName(),
        password: 'password123'
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for missing password', async () => {
    const response = await request(server.server)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email()
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for invalid email format', async () => {
    const response = await request(server.server)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        name: faker.person.fullName(),
        email: 'invalid-email',
        password: 'password123'
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for name too short', async () => {
    const response = await request(server.server)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Jo', // Menos de 3 caracteres
        email: faker.internet.email(),
        password: 'password123'
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for password too short', async () => {
    const response = await request(server.server)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: '123' // Menos de 8 caracteres
      })

    expect(response.status).toEqual(400)
  })

  test('should hash password correctly', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123'
    }

    await request(server.server)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send(userData)

    // Verificar se a senha foi hasheada
    const [createdUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1)

    expect(createdUser.passwordHash).not.toBe(userData.password)
    expect(createdUser.passwordHash).toMatch(/^\$argon2/) // Verificar se é um hash argon2
  })
})
