import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, reports, users, votes, favorites } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'
import jwt from 'jsonwebtoken'

describe('GET /users/me/favorites Route', () => {
  let testUser: any
  let testPlace1: any
  let testPlace2: any
  let testPlace3: any
  let validToken: string

  beforeEach(async () => {
    await server.ready()

    // Limpar dados antes de criar novos
    try {
      await db.delete(favorites)
    } catch (error) {
      // Ignorar erro se a tabela não existir
    }
    await db.delete(votes)
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)

    // Criar usuário de teste
    const [user] = await db.insert(users).values({
      id: randomUUID(),
      name: 'Test User',
      email: `test-user-${Date.now()}@example.com`,
      passwordHash: await hash('password123'),
      role: 'user',
    }).returning()

    testUser = user

    // Criar token válido
    validToken = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET || 'test-secret'
    )

    // Criar locais de teste
    const [place1] = await db.insert(places).values({
      id: randomUUID(),
      placeId: `test-place-1-${Date.now()}`,
      name: 'Restaurante A',
      address: 'Rua A, 123',
      latitude: -23.5505,
      longitude: -46.6333,
      types: ['restaurant', 'food'],
      rating: 4.5,
      userRatingsTotal: 100,
    }).returning()

    const [place2] = await db.insert(places).values({
      id: randomUUID(),
      placeId: `test-place-2-${Date.now()}`,
      name: 'Hospital B',
      address: 'Rua B, 456',
      latitude: -23.5506,
      longitude: -46.6334,
      types: ['hospital', 'health'],
      rating: 4.2,
      userRatingsTotal: 80,
    }).returning()

    const [place3] = await db.insert(places).values({
      id: randomUUID(),
      placeId: `test-place-3-${Date.now()}`,
      name: 'Escola C',
      address: 'Rua C, 789',
      latitude: -23.5507,
      longitude: -46.6335,
      types: ['school', 'education'],
      rating: 4.8,
      userRatingsTotal: 120,
    }).returning()

    testPlace1 = place1
    testPlace2 = place2
    testPlace3 = place3

    // Criar relatórios e votos para testPlace1
    const [report1] = await db.insert(reports).values({
      id: randomUUID(),
      title: 'Report 1',
      description: 'Description 1',
      type: 'safety',
      userId: testUser.id,
      placeId: testPlace1.id,
    }).returning()

    const [report2] = await db.insert(reports).values({
      id: randomUUID(),
      title: 'Report 2',
      description: 'Description 2',
      type: 'accessibility',
      userId: testUser.id,
      placeId: testPlace1.id,
    }).returning()

    // Criar votos para os relatórios
    await db.insert(votes).values({
      userId: testUser.id,
      reportId: report1.id,
    })

    await db.insert(votes).values({
      userId: testUser.id,
      reportId: report2.id,
    })
  })

  afterEach(async () => {
    try {
      await db.delete(favorites)
    } catch (error) {
      // Ignorar erro se a tabela não existir
    }
    await db.delete(votes)
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  it('should return empty list when user has no favorites', async () => {
    const response = await request(server.server)
      .get('/users/me/favorites')
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body.places).toEqual([])
    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 15,
      total: 0,
      totalPages: 0,
    })
  })

  it('should return user favorites with correct data', async () => {
    // Adicionar favoritos
    await db.insert(favorites).values({
      userId: testUser.id,
      placeId: testPlace1.id,
    })

    await db.insert(favorites).values({
      userId: testUser.id,
      placeId: testPlace2.id,
    })

    const response = await request(server.server)
      .get('/users/me/favorites')
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body.places).toHaveLength(2)
    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 15,
      total: 2,
      totalPages: 1,
    })

    // Verificar estrutura dos lugares
    const place = response.body.places[0]
    expect(place).toHaveProperty('id')
    expect(place).toHaveProperty('name')
    expect(place).toHaveProperty('address')
    expect(place).toHaveProperty('reportsCount')
    expect(place).toHaveProperty('votesCount')
    expect(place).toHaveProperty('favoritedAt')
  })

  it('should return correct reportsCount and votesCount', async () => {
    // Adicionar favorito para testPlace1 que tem 2 relatórios e 2 votos
    await db.insert(favorites).values({
      userId: testUser.id,
      placeId: testPlace1.id,
    })

    const response = await request(server.server)
      .get('/users/me/favorites')
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    const place = response.body.places.find((p: any) => p.id === testPlace1.id)
    expect(place).toBeDefined()
    expect(place.reportsCount).toBe(2)
    expect(place.votesCount).toBe(2)
  })

  it('should respect pagination parameters', async () => {
    // Adicionar 3 favoritos
    await db.insert(favorites).values({
      userId: testUser.id,
      placeId: testPlace1.id,
    })
    await db.insert(favorites).values({
      userId: testUser.id,
      placeId: testPlace2.id,
    })
    await db.insert(favorites).values({
      userId: testUser.id,
      placeId: testPlace3.id,
    })

    // Buscar primeira página com limite de 2
    const response = await request(server.server)
      .get('/users/me/favorites?page=1&limit=2')
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body.places).toHaveLength(2)
    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2,
    })
  })

  it('should return 401 for missing authorization header', async () => {
    const response = await request(server.server)
      .get('/users/me/favorites')

    expect(response.status).toEqual(401)
  })

  it('should return 401 for invalid token', async () => {
    const response = await request(server.server)
      .get('/users/me/favorites')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toEqual(401)
  })

  it('should only return favorites for the authenticated user', async () => {
    // Criar outro usuário
    const [otherUser] = await db.insert(users).values({
      id: randomUUID(),
      name: 'Other User',
      email: `other-user-${Date.now()}@example.com`,
      passwordHash: await hash('password123'),
      role: 'user',
    }).returning()

    // Adicionar favoritos para ambos os usuários
    await db.insert(favorites).values({
      userId: testUser.id,
      placeId: testPlace1.id,
    })

    await db.insert(favorites).values({
      userId: otherUser.id,
      placeId: testPlace2.id,
    })

    const response = await request(server.server)
      .get('/users/me/favorites')
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body.places).toHaveLength(1)
    expect(response.body.places[0].id).toBe(testPlace1.id)
  })
})

