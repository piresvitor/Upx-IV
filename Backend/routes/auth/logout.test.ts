/*
3 testes implementados:
Logout com token válido - Retorna 200 com mensagem de sucesso
Logout sem token - Retorna 401 com mensagem de token não fornecido
Logout com token inválido - Retorna 401 com mensagem de token inválido
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'
import jwt from 'jsonwebtoken'

describe('Logout Route', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await db.delete(users)
  })

  test('should logout successfully with valid token', async () => {
    const { user } = await makeUser()
    
    // Criar um token válido
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      message: 'Logout realizado com sucesso. Descarte o token localmente.'
    })
  })

  test('should return 400 for missing authorization header', async () => {
    const response = await request(server.server)
      .post('/auth/logout')

    expect(response.status).toEqual(400)
  })

  test('should return 401 for invalid token', async () => {
    const response = await request(server.server)
      .post('/auth/logout')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toEqual(401)
    expect(response.body).toEqual({
      message: 'Token inválido ou expirado'
    })
  })

  test('should return 400 for malformed authorization header', async () => {
    const response = await request(server.server)
      .post('/auth/logout')
      .set('Authorization', 'InvalidFormat token123')

    expect(response.status).toEqual(400)
  })

  test('should return 401 for expired token', async () => {
    const { user } = await makeUser()
    
    // Criar um token expirado (exp: 1 segundo atrás)
    const expiredToken = jwt.sign(
      { sub: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) - 1 }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${expiredToken}`)

    expect(response.status).toEqual(401)
    expect(response.body).toEqual({
      message: 'Token inválido ou expirado'
    })
  })
})
