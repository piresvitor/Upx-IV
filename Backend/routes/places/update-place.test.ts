import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places } from '../../src/database/schema.ts'

describe('PUT /places/:placeId Route', () => {
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

  it('should update place with valid data', async () => {
    const updateData = {
      name: 'Local Atualizado',
      address: 'Novo Endereço',
      rating: 4.8,
      userRatingsTotal: 150,
    }

    const response = await request(server.server)
      .put(`/places/${testPlaceId}`)
      .send(updateData)

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.name).toBe('Local Atualizado')
    expect(responseData.address).toBe('Novo Endereço')
    expect(responseData.rating).toBe(4.8)
    expect(responseData.userRatingsTotal).toBe(150)
  })

  it('should update only provided fields', async () => {
    const updateData = {
      name: 'Apenas Nome Atualizado',
    }

    const response = await request(server.server)
      .put(`/places/${testPlaceId}`)
      .send(updateData)

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.name).toBe('Apenas Nome Atualizado')
    expect(responseData.address).toBe('Endereço de Teste') // Deve manter o valor original
    expect(responseData.rating).toBe(4.5) // Deve manter o valor original
  })

  it('should return 404 for non-existent placeId', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    
    const response = await request(server.server)
      .put(`/places/${nonExistentId}`)
      .send({ name: 'Novo Nome' })

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({
      error: 'Local não encontrado',
    })
  })

  it('should return 400 for invalid data', async () => {
    const invalidData = {
      rating: 6, // Rating inválido (deve ser 0-5)
    }

    const response = await request(server.server)
      .put(`/places/${testPlaceId}`)
      .send(invalidData)

    expect(response.status).toBe(400)
  })

  it('should return 400 for invalid placeId format', async () => {
    const response = await request(server.server)
      .put('/places/invalid-uuid')
      .send({ name: 'Novo Nome' })

    expect(response.status).toBe(400)
  })
})
