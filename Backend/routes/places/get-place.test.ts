import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, reports, users } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'

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
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
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
      reportsCount: 0,
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

  it('should return place with correct reports count', async () => {
    // Criar um usuário para os relatos
    const [user] = await db.insert(users).values({
      id: randomUUID(),
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      passwordHash: await hash('password123'),
    }).returning()

    // Criar alguns relatos para o local
    await db.insert(reports).values([
      {
        id: randomUUID(),
        title: 'Relato 1',
        description: 'Descrição 1',
        type: 'accessibility',
        userId: user.id,
        placeId: testPlaceId,
        rampaAcesso: true,
        banheiroAcessivel: false,
        estacionamentoAcessivel: true,
        acessibilidadeVisual: false,
      },
      {
        id: randomUUID(),
        title: 'Relato 2',
        description: 'Descrição 2',
        type: 'safety',
        userId: user.id,
        placeId: testPlaceId,
        rampaAcesso: false,
        banheiroAcessivel: true,
        estacionamentoAcessivel: false,
        acessibilidadeVisual: true,
      },
    ])

    const response = await request(server.server)
      .get(`/places/${testPlaceId}`)

    expect(response.status).toBe(200)
    expect(response.body.reportsCount).toBe(2)
  })
})
