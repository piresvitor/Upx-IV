/*
7 testes implementados:
DELETE /users/me com token válido e senha correta - Exclui conta com sucesso
DELETE /users/me sem token - Retorna 400
DELETE /users/me com token inválido - Retorna 401
DELETE /users/me sem senha - Retorna 400
DELETE /users/me com senha incorreta - Retorna 403
DELETE /users/me com usuário não encontrado - Retorna 404
DELETE /users/me com exclusão em cascata - Exclui usuário e registros relacionados
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import { db } from '../../src/database/cliente.ts'
import { users, reports, votes, places } from '../../src/database/schema.ts'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

describe('DELETE /users/me Route', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste (ordem importante devido às foreign keys)
    await db.delete(votes)
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  test('should delete user account with valid token and correct password', async () => {
    const { user, passwordBeforeHash } = await makeUser()
    
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .delete('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: passwordBeforeHash })

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

  test('should return 400 for missing password', async () => {
    const { user } = await makeUser()
    
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .delete('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(response.status).toEqual(400)
    expect(response.body.message).toBe('Senha é obrigatória para excluir a conta')
  })

  test('should return 403 for incorrect password', async () => {
    const { user } = await makeUser()
    
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .delete('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'senha_incorreta' })

    expect(response.status).toEqual(403)
    expect(response.body.message).toBe('Senha incorreta')
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
      .send({ password: 'qualquer_senha' })

    expect(response.status).toEqual(404)
    expect(response.body.message).toBe('Usuário não encontrado')
  })

  test('should delete user and all related records (cascade delete)', async () => {
    const { user, passwordBeforeHash } = await makeUser()
    
    // Criar um segundo usuário para criar reports e votes
    const { user: otherUser } = await makeUser()
    
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    // Criar um local de teste
    const placeId = randomUUID()
    await db.insert(places).values({
      id: placeId,
      placeId: 'test-place-id',
      name: 'Test Place',
      address: 'Test Address',
      latitude: -23.5505,
      longitude: -46.6333,
      types: ['restaurant']
    })

    // Criar reports do usuário
    const report1Id = randomUUID()
    const report2Id = randomUUID()
    await db.insert(reports).values([
      {
        id: report1Id,
        title: 'Report 1',
        description: 'Description 1',
        type: 'accessibility',
        userId: user.id,
        placeId: placeId
      },
      {
        id: report2Id,
        title: 'Report 2',
        description: 'Description 2',
        type: 'safety',
        userId: user.id,
        placeId: placeId
      }
    ])

    // Criar votes do usuário nos reports
    await db.insert(votes).values([
      {
        userId: user.id,
        reportId: report1Id
      },
      {
        userId: user.id,
        reportId: report2Id
      }
    ])

    // Criar votes de outros usuários nos reports do usuário
    await db.insert(votes).values([
      {
        userId: otherUser.id,
        reportId: report1Id
      },
      {
        userId: otherUser.id,
        reportId: report2Id
      }
    ])

    // Excluir o usuário
    const response = await request(server.server)
      .delete('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: passwordBeforeHash })

    expect(response.status).toEqual(200)
    expect(response.body.message).toBe('Conta excluída com sucesso')

    // Verificar se o usuário foi excluído
    const [deletedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)
    expect(deletedUser).toBeUndefined()

    // Verificar se os reports do usuário foram excluídos
    const userReports = await db
      .select()
      .from(reports)
      .where(eq(reports.userId, user.id))
    expect(userReports).toHaveLength(0)

    // Verificar se os votes do usuário foram excluídos
    const userVotes = await db
      .select()
      .from(votes)
      .where(eq(votes.userId, user.id))
    expect(userVotes).toHaveLength(0)

    // Verificar se os votes dos reports do usuário foram excluídos
    const reportVotes = await db
      .select()
      .from(votes)
      .where(eq(votes.reportId, report1Id))
    expect(reportVotes).toHaveLength(0)
  })
})
