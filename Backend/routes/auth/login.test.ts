/*
6 testes implementados
Login com credenciais válidas - Verifica se retorna token JWT
Email inválido - Retorna 400 com mensagem de credenciais inválidas
Senha inválida - Retorna 400 com mensagem de credenciais inválidas
Email ausente - Retorna 400 (validação do schema)
Senha ausente - Retorna 400 (validação do schema)
Formato de email inválido - Retorna 400 (validação do schema)
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'

describe('Login Route', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Não limpar o banco - usar banco de teste separado
  })

  test('should login successfully with valid credentials', async () => {
    const { user, passwordBeforeHash } = await makeUser()
    
    const response = await request(server.server)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: user.email,
        password: passwordBeforeHash,
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('token')
    expect(typeof response.body.token).toBe('string')
  })

  test('should return 400 for invalid email', async () => {
    const response = await request(server.server)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      })

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({
      message: 'Credenciais inválidas'
    })
  })

  test('should return 400 for invalid password', async () => {
    const { user } = await makeUser()
    
    const response = await request(server.server)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: user.email,
        password: 'wrongpassword',
      })

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({
      message: 'Credenciais inválidas'
    })
  })

  test('should return 400 for missing email', async () => {
    const response = await request(server.server)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        password: 'password123',
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for missing password', async () => {
    const response = await request(server.server)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'test@example.com',
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for invalid email format', async () => {
    const response = await request(server.server)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'invalid-email',
        password: 'password123',
      })

    expect(response.status).toEqual(400)
  })
})
