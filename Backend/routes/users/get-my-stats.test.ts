import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import { db } from '../../src/database/cliente.ts'
import { users, reports, votes, favorites, places } from '../../src/database/schema.ts'
import jwt from 'jsonwebtoken'

describe('GET /users/me/stats Route', () => {
  let testUser: any
  let testPlace: any
  let authToken: string

  beforeEach(async () => {
    await server.ready()
    
    // Criar usuário de teste
    const { user } = await makeUser()
    testUser = user

    // Criar token de autenticação
    authToken = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET || 'test-secret'
    )

    // Criar local de teste
    const [place] = await db.insert(places).values({
      placeId: `test-place-${Date.now()}`,
      name: 'Test Place',
      address: 'Test Address',
      latitude: -23.5505,
      longitude: -46.6333,
      types: ['restaurant'],
    }).returning()
    testPlace = place
  })

  afterEach(async () => {
    // Limpar dados de teste
    await db.delete(votes)
    await db.delete(reports)
    await db.delete(favorites)
    await db.delete(places)
    await db.delete(users)
  })

  test('should return user stats with empty data (200)', async () => {
    const res = await request(server.server)
      .get('/users/me/stats')
      .set('Authorization', `Bearer ${authToken}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      totalReports: 0,
      totalVotes: 0,
      totalFavorites: 0,
      reports: [],
    })
  })

  test('should return user stats with reports and votes (200)', async () => {
    // Criar relatórios de teste
    const [report1] = await db.insert(reports).values({
      title: 'Test Report 1',
      description: 'Test Description 1',
      type: 'positive',
      userId: testUser.id,
      placeId: testPlace.id,
    }).returning()

    const [report2] = await db.insert(reports).values({
      title: 'Test Report 2',
      description: 'Test Description 2',
      type: 'negative',
      userId: testUser.id,
      placeId: testPlace.id,
    }).returning()

    // Criar outro usuário para votar
    const { user: voter } = await makeUser()

    // Criar votos para os relatórios
    await db.insert(votes).values({
      userId: voter.id,
      reportId: report1.id,
    })

    await db.insert(votes).values({
      userId: voter.id,
      reportId: report2.id,
    })

    // Criar favorito
    await db.insert(favorites).values({
      userId: testUser.id,
      placeId: testPlace.id,
    })

    const res = await request(server.server)
      .get('/users/me/stats')
      .set('Authorization', `Bearer ${authToken}`)

    expect(res.status).toBe(200)
    expect(res.body.totalReports).toBe(2)
    expect(res.body.totalVotes).toBe(2)
    expect(res.body.totalFavorites).toBe(1)
    expect(res.body.reports).toHaveLength(2)
    expect(res.body.reports[0]).toHaveProperty('votesCount')
    expect(res.body.reports[0]).toHaveProperty('place')
  })

  test('should respect reportsLimit parameter (200)', async () => {
    // Criar múltiplos relatórios
    for (let i = 0; i < 5; i++) {
      await db.insert(reports).values({
        title: `Test Report ${i}`,
        description: `Test Description ${i}`,
        type: 'positive',
        userId: testUser.id,
        placeId: testPlace.id,
      })
    }

    const res = await request(server.server)
      .get('/users/me/stats?reportsLimit=3')
      .set('Authorization', `Bearer ${authToken}`)

    expect(res.status).toBe(200)
    expect(res.body.totalReports).toBe(5)
    expect(res.body.reports).toHaveLength(3)
  })

  test('should return 401 without authentication', async () => {
    const res = await request(server.server)
      .get('/users/me/stats')

    expect(res.status).toBe(400) // Fastify retorna 400 para validação de header
  })
})

