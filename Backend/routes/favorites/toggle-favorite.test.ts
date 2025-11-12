import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, users, favorites } from '../../src/database/schema.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

describe('POST /places/:placeId/favorites Route', () => {
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

  test('should add place to favorites when not favorited', async () => {
    const response = await request(server.server)
      .post(`/places/${testPlace.id}/favorites`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('isFavorite', true)
    expect(response.body).toHaveProperty('message', 'Local adicionado aos favoritos')
  })

  test('should remove place from favorites when already favorited', async () => {
    // Primeiro adicionar aos favoritos
    await request(server.server)
      .post(`/places/${testPlace.id}/favorites`)
      .set('Authorization', `Bearer ${validToken}`)

    // Depois remover dos favoritos
    const response = await request(server.server)
      .post(`/places/${testPlace.id}/favorites`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('isFavorite', false)
    expect(response.body).toHaveProperty('message', 'Local removido dos favoritos')
  })

  test('should return 401 for missing authorization header', async () => {
    const response = await request(server.server)
      .post(`/places/${testPlace.id}/favorites`)

    expect(response.status).toEqual(401)
  })

  test('should return 401 for invalid token', async () => {
    const response = await request(server.server)
      .post(`/places/${testPlace.id}/favorites`)
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toEqual(401)
  })

  test('should return 404 for non-existent place', async () => {
    const nonExistentPlaceId = randomUUID()

    const response = await request(server.server)
      .post(`/places/${nonExistentPlaceId}/favorites`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(404)
    expect(response.body).toHaveProperty('error', 'Local não encontrado')
  })

  test('should return 400 for invalid placeId format', async () => {
    const response = await request(server.server)
      .post('/places/invalid-uuid/favorites')
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(400)
  })

  test('should toggle favorite multiple times correctly', async () => {
    // Adicionar
    const addResponse = await request(server.server)
      .post(`/places/${testPlace.id}/favorites`)
      .set('Authorization', `Bearer ${validToken}`)
    
    expect(addResponse.body.isFavorite).toBe(true)

    // Remover
    const removeResponse = await request(server.server)
      .post(`/places/${testPlace.id}/favorites`)
      .set('Authorization', `Bearer ${validToken}`)
    
    expect(removeResponse.body.isFavorite).toBe(false)

    // Adicionar novamente
    const addAgainResponse = await request(server.server)
      .post(`/places/${testPlace.id}/favorites`)
      .set('Authorization', `Bearer ${validToken}`)
    
    expect(addAgainResponse.body.isFavorite).toBe(true)
  })
})

