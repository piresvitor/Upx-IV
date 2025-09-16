/*
3 testes implementados:
DELETE /users/me com token válido - Exclui conta com sucesso
DELETE /users/me sem token - Retorna 400
DELETE /users/me com token inválido - Retorna 401
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

describe('DELETE /users/me Route', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await db.delete(users)
  })

  test('should delete user account with valid token', async () => {
    const { user } = await makeUser()
    
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .delete('/users/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body.message).toBe('Conta excluída com sucesso')

    // Verificar se o usuário foi realmente excluído
    const [deletedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    expect(deletedUser).toBeUndefined()
  })

  test('should return 400 for missing authorization header', async () => {
    const response = await request(server.server)
      .delete('/users/me')

    expect(response.status).toEqual(400)
  })

  test('should return 401 for invalid token', async () => {
    const response = await request(server.server)
      .delete('/users/me')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toEqual(401)
    expect(response.body.message).toBe('Token inválido ou expirado')
  })

  test('should return 404 for non-existent user', async () => {
    // Criar um token para um usuário que não existe no banco
    const fakeUserId = '00000000-0000-0000-0000-000000000000'
    const token = jwt.sign(
      { sub: fakeUserId, role: 'user' }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .delete('/users/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(404)
    expect(response.body.message).toBe('Usuário não encontrado')
  })
})
