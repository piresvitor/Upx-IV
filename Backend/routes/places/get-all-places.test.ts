import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, reports } from '../../src/database/schema.ts'

describe('GET /places Route', () => {
  beforeEach(async () => {
    await server.ready()
    
    // Limpar e criar locais de teste (remover relatos antes por FK)
    await db.delete(reports)
    await db.delete(places)
    
    await db.insert(places).values([
      {
        placeId: 'test-place-1-' + Date.now(),
        name: 'Restaurante A',
        address: 'Rua A, 123',
        latitude: -23.5505,
        longitude: -46.6333,
        types: ['restaurant', 'food'],
        rating: 4.5,
        userRatingsTotal: 100,
      },
      {
        placeId: 'test-place-2-' + Date.now(),
        name: 'Hospital B',
        address: 'Rua B, 456',
        latitude: -23.5506,
        longitude: -46.6334,
        types: ['hospital', 'health'],
        rating: 4.2,
        userRatingsTotal: 80,
      },
      {
        placeId: 'test-place-3-' + Date.now(),
        name: 'Escola C',
        address: 'Rua C, 789',
        latitude: -23.5507,
        longitude: -46.6335,
        types: ['school', 'education'],
        rating: 4.8,
        userRatingsTotal: 120,
      },
    ])
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste (remover relatos antes por FK)
    await db.delete(reports)
    await db.delete(places)
  })

  it('should return all places with default pagination', async () => {
    const response = await request(server.server)
      .get('/places')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.places).toHaveLength(3)
    expect(responseData.pagination).toMatchObject({
      page: 1,
      limit: 10,
      total: 3,
      totalPages: 1,
    })
  })

  it('should return places with custom pagination', async () => {
    const response = await request(server.server)
      .get('/places?page=1&limit=2')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.places).toHaveLength(2)
    expect(responseData.pagination).toMatchObject({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2,
    })
  })

  it('should filter places by search term', async () => {
    const response = await request(server.server)
      .get('/places?search=Restaurante')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.places).toHaveLength(1)
    expect(responseData.places[0].name).toBe('Restaurante A')
  })

  it('should filter places by type', async () => {
    const response = await request(server.server)
      .get('/places?type=hospital')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.places).toHaveLength(1)
    expect(responseData.places[0].name).toBe('Hospital B')
  })

  it('should sort places by name ascending', async () => {
    const response = await request(server.server)
      .get('/places?sortBy=name&sortOrder=asc')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.places[0].name).toBe('Escola C')
    expect(responseData.places[1].name).toBe('Hospital B')
    expect(responseData.places[2].name).toBe('Restaurante A')
  })

  it('should sort places by rating descending', async () => {
    const response = await request(server.server)
      .get('/places?sortBy=rating&sortOrder=desc')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.places[0].rating).toBe(4.8) // Escola C
    expect(responseData.places[1].rating).toBe(4.5) // Restaurante A
    expect(responseData.places[2].rating).toBe(4.2) // Hospital B
  })

  it('should return 400 for invalid pagination parameters', async () => {
    const response = await request(server.server)
      .get('/places?page=0&limit=-1')

    expect(response.status).toBe(400)
  })

  it('should return 400 for invalid sort parameters', async () => {
    const response = await request(server.server)
      .get('/places?sortBy=invalid&sortOrder=invalid')

    expect(response.status).toBe(400)
  })
})
