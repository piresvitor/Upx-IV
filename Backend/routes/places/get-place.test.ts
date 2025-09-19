import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places } from '../../src/database/schema.ts'

describe('GET /places/:placeId Route', () => {
  let testPlaceId: string

  beforeEach(async () => {
    await server.ready()
    
    // Limpar e criar um local de teste
    await db.delete(places)
    
    const [testPlace] = await db
      .insert(places)
      .values({
        placeId: 'test-place-id-' + Date.now(),
        name: 'Local de Teste',
        address: 'Endereço de Teste',
        latitude: -23.5505,
        longitude: -46.6333,
        types: ['restaurant'],
        rating: 4.5,
        userRatingsTotal: 100,
      })
      .returning()
    
    testPlaceId = testPlace.id
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await db.delete(places)
  })

  it('should return place details for valid placeId', async () => {
    const response = await request(server.server)
      .get(`/places/${testPlaceId}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: testPlaceId,
      name: 'Local de Teste',
      address: 'Endereço de Teste',
      latitude: -23.5505,
      longitude: -46.6333,
      types: ['restaurant'],
      rating: 4.5,
      userRatingsTotal: 100,
    })
  })

  it('should return 404 for non-existent placeId', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    
    const response = await request(server.server)
      .get(`/places/${nonExistentId}`)

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({
      error: 'Local não encontrado',
    })
  })

  it('should return 400 for invalid placeId format', async () => {
    const response = await request(server.server)
      .get('/places/invalid-uuid')

    expect(response.status).toBe(400)
  })
})
