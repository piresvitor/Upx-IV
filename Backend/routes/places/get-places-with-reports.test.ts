import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, reports, users, votes } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'

describe('GET /places/with-reports Route', () => {
  let testUser1: any
  let testUser2: any
  let testPlace1: any
  let testPlace2: any
  let testPlace3: any

  beforeEach(async () => {
    await server.ready()

    // Limpar dados antes de criar novos
    await db.delete(votes)
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)

    // Criar usuários de teste
    const [user1] = await db.insert(users).values({
      id: randomUUID(),
      name: 'Test User 1',
      email: `test-user-1-${Date.now()}@example.com`,
      passwordHash: await hash('password123'),
      role: 'user',
    }).returning()

    const [user2] = await db.insert(users).values({
      id: randomUUID(),
      name: 'Test User 2',
      email: `test-user-2-${Date.now()}@example.com`,
      passwordHash: await hash('password123'),
      role: 'user',
    }).returning()

    testUser1 = user1
    testUser2 = user2

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

    // Criar relatórios para place1 (2 relatórios)
    const [report1] = await db.insert(reports).values({
      id: randomUUID(),
      title: 'Relato 1',
      description: 'Descrição do relato 1',
      type: 'accessibility',
      userId: testUser1.id,
      placeId: testPlace1.id,
      rampaAcesso: true,
      banheiroAcessivel: false,
      estacionamentoAcessivel: true,
      acessibilidadeVisual: false,
    }).returning()

    const [report2] = await db.insert(reports).values({
      id: randomUUID(),
      title: 'Relato 2',
      description: 'Descrição do relato 2',
      type: 'accessibility',
      userId: testUser2.id,
      placeId: testPlace1.id,
      rampaAcesso: true,
      banheiroAcessivel: true,
      estacionamentoAcessivel: false,
      acessibilidadeVisual: true,
    }).returning()

    // Criar relatórios para place2 (1 relatório)
    const [report3] = await db.insert(reports).values({
      id: randomUUID(),
      title: 'Relato 3',
      description: 'Descrição do relato 3',
      type: 'accessibility',
      userId: testUser1.id,
      placeId: testPlace2.id,
      rampaAcesso: false,
      banheiroAcessivel: true,
      estacionamentoAcessivel: true,
      acessibilidadeVisual: false,
    }).returning()

    // Criar votos
    // Report1: 2 votos
    await db.insert(votes).values([
      { userId: testUser1.id, reportId: report1.id },
      { userId: testUser2.id, reportId: report1.id },
    ])

    // Report2: 1 voto
    await db.insert(votes).values([
      { userId: testUser1.id, reportId: report2.id },
    ])

    // Report3: 2 votos (um de cada usuário)
    await db.insert(votes).values([
      { userId: testUser1.id, reportId: report3.id },
      { userId: testUser2.id, reportId: report3.id },
    ])
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await db.delete(votes)
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  it('should return places with reports and correct counts', async () => {
    const response = await request(server.server)
      .get('/places/with-reports')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('pagination')
    expect(Array.isArray(response.body.places)).toBe(true)
    expect(response.body.places.length).toBeGreaterThan(0)

    // Verificar que todos os locais retornados têm relatórios
    response.body.places.forEach((place: any) => {
      expect(place).toHaveProperty('id')
      expect(place).toHaveProperty('name')
      expect(place).toHaveProperty('reportsCount')
      expect(place).toHaveProperty('votesCount')
      expect(typeof place.reportsCount).toBe('number')
      expect(typeof place.votesCount).toBe('number')
      expect(place.reportsCount).toBeGreaterThan(0)
    })
  })

  it('should return correct reports and votes counts for each place', async () => {
    const response = await request(server.server)
      .get('/places/with-reports')

    expect(response.status).toBe(200)
    const places = response.body.places

    // Encontrar place1 e place2 nos resultados
    const place1Result = places.find((p: any) => p.id === testPlace1.id)
    const place2Result = places.find((p: any) => p.id === testPlace2.id)

    if (place1Result) {
      // Place1 tem 2 relatórios e 3 votos no total (2 do report1 + 1 do report2)
      expect(place1Result.reportsCount).toBe(2)
      expect(place1Result.votesCount).toBe(3)
    }

    if (place2Result) {
      // Place2 tem 1 relatório e 2 votos
      expect(place2Result.reportsCount).toBe(1)
      expect(place2Result.votesCount).toBe(2)
    }
  })

  it('should not return places without reports', async () => {
    const response = await request(server.server)
      .get('/places/with-reports')

    expect(response.status).toBe(200)
    const places = response.body.places

    // Place3 não tem relatórios, então não deve aparecer
    const place3Result = places.find((p: any) => p.id === testPlace3.id)
    expect(place3Result).toBeUndefined()
  })

  it('should return places with default pagination (15 items)', async () => {
    const response = await request(server.server)
      .get('/places/with-reports')

    expect(response.status).toBe(200)
    expect(response.body.pagination).toMatchObject({
      page: 1,
      limit: 15,
    })
    expect(response.body.places.length).toBeLessThanOrEqual(15)
  })

  it('should return places with custom pagination', async () => {
    const response = await request(server.server)
      .get('/places/with-reports?page=1&limit=1')

    expect(response.status).toBe(200)
    expect(response.body.places.length).toBeLessThanOrEqual(1)
    expect(response.body.pagination).toMatchObject({
      page: 1,
      limit: 1,
    })
  })

  it('should filter places by search term (name)', async () => {
    const response = await request(server.server)
      .get('/places/with-reports?search=Restaurante')

    expect(response.status).toBe(200)
    const places = response.body.places

    // Todos os locais retornados devem ter "Restaurante" no nome
    places.forEach((place: any) => {
      expect(place.name.toLowerCase()).toContain('restaurante')
    })
  })

  it('should filter places by search term (address)', async () => {
    const response = await request(server.server)
      .get('/places/with-reports?search=Rua A')

    expect(response.status).toBe(200)
    const places = response.body.places

    // Todos os locais retornados devem ter "Rua A" no endereço
    places.forEach((place: any) => {
      if (place.address) {
        expect(place.address.toLowerCase()).toContain('rua a')
      }
    })
  })

  it('should return empty array when no places match search', async () => {
    const response = await request(server.server)
      .get('/places/with-reports?search=NonExistentPlace123')

    expect(response.status).toBe(200)
    expect(response.body.places).toHaveLength(0)
    expect(response.body.pagination.total).toBe(0)
  })

  it('should return empty array when no places have reports', async () => {
    // Limpar todos os relatórios
    await db.delete(votes)
    await db.delete(reports)

    const response = await request(server.server)
      .get('/places/with-reports')

    expect(response.status).toBe(200)
    expect(response.body.places).toHaveLength(0)
    expect(response.body.pagination).toMatchObject({
      page: 1,
      limit: 15,
      total: 0,
      totalPages: 0,
    })
  })

  it('should return 400 for invalid page parameter', async () => {
    const response = await request(server.server)
      .get('/places/with-reports?page=0')

    expect(response.status).toBe(400)
  })

  it('should return 400 for invalid limit parameter (too high)', async () => {
    const response = await request(server.server)
      .get('/places/with-reports?limit=20')

    expect(response.status).toBe(400)
  })

  it('should return 400 for invalid limit parameter (negative)', async () => {
    const response = await request(server.server)
      .get('/places/with-reports?limit=-1')

    expect(response.status).toBe(400)
  })

  it('should handle pagination correctly', async () => {
    // Criar mais locais com relatórios para testar paginação
    const [place4] = await db.insert(places).values({
      id: randomUUID(),
      placeId: `test-place-4-${Date.now()}`,
      name: 'Local D',
      address: 'Rua D, 101',
      latitude: -23.5508,
      longitude: -46.6336,
      types: ['store'],
      rating: 4.0,
      userRatingsTotal: 50,
    }).returning()

    await db.insert(reports).values({
      id: randomUUID(),
      title: 'Relato 4',
      description: 'Descrição do relato 4',
      type: 'accessibility',
      userId: testUser1.id,
      placeId: place4.id,
      rampaAcesso: true,
      banheiroAcessivel: false,
      estacionamentoAcessivel: false,
      acessibilidadeVisual: false,
    })

    const response = await request(server.server)
      .get('/places/with-reports?page=1&limit=2')

    expect(response.status).toBe(200)
    expect(response.body.places.length).toBeLessThanOrEqual(2)
    expect(response.body.pagination.page).toBe(1)
    expect(response.body.pagination.limit).toBe(2)
    expect(response.body.pagination.total).toBeGreaterThanOrEqual(2)
  })
})

