/*
Testes para a rota POST /places/check-or-create
- Verifica se local existe e retorna dados existentes
- Cria novo local quando não existe
- Retorna erro 400 para placeId inválido
- Retorna erro 400 para placeId ausente
- Retorna erro 404 para placeId não encontrado no Google Maps
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places } from '../../src/database/schema.ts'

describe('POST /places/check-or-create Route', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await db.delete(places)
  })

  test('should return existing place when placeId exists in database', async () => {
    // Primeiro, criar um local no banco com placeId único
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

    const response = await request(server.server)
      .post('/places/check-or-create')
      .send({
        placeId: uniquePlaceId
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('exists', true)
    expect(response.body).toHaveProperty('place')
    expect(response.body).toHaveProperty('message', 'Local já existe no sistema')
    expect(response.body.place.id).toBe(createdPlace.id)
    expect(response.body.place.placeId).toBe(uniquePlaceId)
  })

  test('should create new place when placeId does not exist', async () => {
    // Usar um place_id válido do Google Maps (exemplo real)
    const response = await request(server.server)
      .post('/places/check-or-create')
      .send({
        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4' // Place ID real do Google Maps
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('exists', false)
    expect(response.body).toHaveProperty('place')
    expect(response.body).toHaveProperty('message', 'Local criado com sucesso no sistema')
    expect(response.body.place.placeId).toBe('ChIJN1t_tDeuEmsRUsoyG83frY4')
    expect(response.body.place).toHaveProperty('id')
    expect(response.body.place).toHaveProperty('name')
    expect(response.body.place).toHaveProperty('latitude')
    expect(response.body.place).toHaveProperty('longitude')
  })

  test('should return 400 for empty placeId', async () => {
    const response = await request(server.server)
      .post('/places/check-or-create')
      .send({
        placeId: ''
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for missing placeId', async () => {
    const response = await request(server.server)
      .post('/places/check-or-create')
      .send({})

    expect(response.status).toEqual(400)
  })

  test('should return 500 for invalid placeId format (Google Maps API error)', async () => {
    const response = await request(server.server)
      .post('/places/check-or-create')
      .send({
        placeId: 'invalid-place-id'
      })

    expect(response.status).toEqual(500)
  })

  test('should return 500 for non-existent placeId in Google Maps (API error)', async () => {
    const response = await request(server.server)
      .post('/places/check-or-create')
      .send({
        placeId: 'ChIJInvalidPlaceId123456789'
      })

    expect(response.status).toEqual(500)
  })

  test('should handle Google Maps API errors gracefully', async () => {
    // Testar com um place_id que pode causar erro na API
    const response = await request(server.server)
      .post('/places/check-or-create')
      .send({
        placeId: 'ChIJInvalidPlaceId'
      })

    // Pode retornar 404 ou 500 dependendo do erro da API
    expect([404, 500]).toContain(response.status)
  })
})
