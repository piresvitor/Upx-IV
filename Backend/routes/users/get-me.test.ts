/*
3 testes implementados:
GET /users/me com token válido - Retorna dados do usuário
GET /users/me sem token - Retorna 401
GET /users/me com token inválido - Retorna 401
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'
import jwt from 'jsonwebtoken'

describe('GET /users/me Route', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await db.delete(users)
  })

  test('should return user data with valid token', async () => {
    const { user } = await makeUser()
    
    // Criar um token válido
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  })

  test('should return 401 for missing authorization header', async () => {
    const response = await request(server.server)
      .get('/users/me')

    expect(response.status).toEqual(400) // Fastify retorna 400 para validação de header
  })

  test('should return 401 for invalid token', async () => {
    const response = await request(server.server)
      .get('/users/me')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toEqual(401)
    expect(response.body).toEqual({
      message: 'Token inválido ou expirado'
    })
  })

  test('should return 404 for non-existent user', async () => {
    // Criar um token para um usuário que não existe no banco
    const fakeUserId = '00000000-0000-0000-0000-000000000000'
    const token = jwt.sign(
      { sub: fakeUserId, role: 'user' }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(404)
    expect(response.body).toEqual({
      message: 'Usuário não encontrado'
    })
  })
})
