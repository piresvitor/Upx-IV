import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, users, favorites } from '../../src/database/schema.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'

describe('GET /places/:placeId/favorites/check Route', () => {
  let testUser: any
  let testPlace: any
  let validToken: string

  beforeEach(async () => {
    await server.ready()
    
    // Criar usuário de teste
    const { user } = await makeUser()
    testUser = user

    // Criar token válido
    validToken = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET || 'test-secret'
    )

    // Criar local de teste
    const uniquePlaceId = `ChIJN1t_tDeuEmsRUsoyG83frY4_${Date.now()}`
    const [createdPlace] = await db.insert(places).values({
      placeId: uniquePlaceId,
      name: 'Test Place',
      address: 'Test Address',
      latitude: -23.5505,
      longitude: -46.6333,
      types: ['restaurant'],
      rating: 4.5,
      userRatingsTotal: 100
    }).returning()
    
    testPlace = createdPlace
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    try {
      await db.delete(favorites)
    } catch (error) {
      // Ignorar erro se a tabela não existir
    }
    await db.delete(places)
    await db.delete(users)
  })

  test('should return isFavorite: false when place is not favorited', async () => {
    const response = await request(server.server)
      .get(`/places/${testPlace.id}/favorites/check`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('isFavorite', false)
  })

  test('should return isFavorite: true when place is favorited', async () => {
    // Adicionar aos favoritos
    await db.insert(favorites).values({
      userId: testUser.id,
      placeId: testPlace.id,
    })

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/favorites/check`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('isFavorite', true)
  })

  test('should return 401 for missing authorization header', async () => {
    const response = await request(server.server)
      .get(`/places/${testPlace.id}/favorites/check`)

    expect(response.status).toEqual(401)
  })

  test('should return 401 for invalid token', async () => {
    const response = await request(server.server)
      .get(`/places/${testPlace.id}/favorites/check`)
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toEqual(401)
  })

  test('should return 400 for invalid placeId format', async () => {
    const response = await request(server.server)
      .get('/places/invalid-uuid/favorites/check')
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(400)
  })

  test('should only check favorites for the authenticated user', async () => {
    // Criar outro usuário
    const [otherUser] = await db.insert(users).values({
      id: randomUUID(),
      name: 'Other User',
      email: `other-user-${Date.now()}@example.com`,
      passwordHash: await hash('password123'),
      role: 'user',
    }).returning()

    // Adicionar favorito para outro usuário
    await db.insert(favorites).values({
      userId: otherUser.id,
      placeId: testPlace.id,
    })

    // Verificar para o usuário autenticado (que não tem favorito)
    const response = await request(server.server)
      .get(`/places/${testPlace.id}/favorites/check`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('isFavorite', false)
  })
})

