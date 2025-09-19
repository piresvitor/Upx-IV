/*
Testes para a rota GET /places/search-nearby
- Busca locais próximos com parâmetros válidos
- Retorna erro 400 para latitude inválida
- Retorna erro 400 para longitude inválida
- Retorna erro 400 para raio inválido
- Retorna erro 400 para parâmetros ausentes
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, reports } from '../../src/database/schema.ts'

describe('GET /places/search-nearby Route', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste (remover relatos antes por FK)
    await db.delete(reports)
    await db.delete(places)
  })

  test('should search nearby places with valid parameters', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: -23.5505,
        longitude: -46.6333,
        radius: 1000
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
    expect(Array.isArray(response.body.places)).toBe(true)
    expect(Array.isArray(response.body.googlePlaces)).toBe(true)
  })

  test('should search nearby places with type filter', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: -23.5505,
        longitude: -46.6333,
        radius: 1000,
        type: 'restaurant'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
  })

  test('should search nearby places with keyword filter', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: -23.5505,
        longitude: -46.6333,
        radius: 1000,
        keyword: 'pizza'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
  })

  test('should return 400 for invalid latitude', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: 'invalid',
        longitude: -46.6333,
        radius: 1000
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for latitude out of range', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: 91, // Latitude deve estar entre -90 e 90
        longitude: -46.6333,
        radius: 1000
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for invalid longitude', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: -23.5505,
        longitude: 'invalid',
        radius: 1000
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for longitude out of range', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: -23.5505,
        longitude: 181, // Longitude deve estar entre -180 e 180
        radius: 1000
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for invalid radius', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: -23.5505,
        longitude: -46.6333,
        radius: 'invalid'
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for radius out of range', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: -23.5505,
        longitude: -46.6333,
        radius: 60000 // Raio deve estar entre 1 e 50000
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for missing latitude', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        longitude: -46.6333,
        radius: 1000
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for missing longitude', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: -23.5505,
        radius: 1000
      })

    expect(response.status).toEqual(400)
  })

  test('should use default radius when not provided', async () => {
    const response = await request(server.server)
      .get('/places/search-nearby')
      .query({
        latitude: -23.5505,
        longitude: -46.6333
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
  })
})
