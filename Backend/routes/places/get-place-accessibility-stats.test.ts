import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { users, places, reports } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'

describe('GET /places/:placeId/accessibility-stats', () => {
  let testUser: any
  let testPlace: any

  beforeEach(async () => {
    await server.ready()

    // Criar usuário de teste
    const [user] = await db.insert(users).values({
      id: randomUUID(),
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      passwordHash: await hash('password123'),
      role: 'user'
    }).returning()

    testUser = user

    // Criar local de teste
    const [place] = await db.insert(places).values({
      id: randomUUID(),
      placeId: `place_${Date.now()}`,
      name: 'Test Place',
      address: 'Rua Teste, 123',
      latitude: -23.5505,
      longitude: -46.6333,
      types: ['restaurant'],
      rating: 4.2,
      userRatingsTotal: 100
    }).returning()

    testPlace = place
  })

  afterEach(async () => {
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  test('should return accessibility stats for place with majority positive reports', async () => {
    // Criar relatos com maioria positiva para todos os campos
    await db.insert(reports).values([
      {
        id: randomUUID(),
        title: 'Relato 1',
        description: 'Descrição 1',
        type: 'accessibility',
        userId: testUser.id,
        placeId: testPlace.id,
        rampaAcesso: true,
        banheiroAcessivel: true,
        estacionamentoAcessivel: true,
        acessibilidadeVisual: true
      },
      {
        id: randomUUID(),
        title: 'Relato 2',
        description: 'Descrição 2',
        type: 'accessibility',
        userId: testUser.id,
        placeId: testPlace.id,
        rampaAcesso: true,
        banheiroAcessivel: true,
        estacionamentoAcessivel: false,
        acessibilidadeVisual: true
      },
      {
        id: randomUUID(),
        title: 'Relato 3',
        description: 'Descrição 3',
        type: 'accessibility',
        userId: testUser.id,
        placeId: testPlace.id,
        rampaAcesso: true,
        banheiroAcessivel: false,
        estacionamentoAcessivel: true,
        acessibilidadeVisual: false
      }
    ])

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/accessibility-stats`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('place')
    expect(response.body.place).toMatchObject({
      id: testPlace.id,
      name: 'Test Place',
      address: 'Rua Teste, 123'
    })
    expect(response.body.totalReports).toBe(3)

    // Verificar estatísticas - maioria positiva (66.67% > 50%)
    expect(response.body.accessibilityStats.rampaAcesso.hasMajority).toBe(true)
    expect(response.body.accessibilityStats.rampaAcesso.percentage).toBe(100)
    expect(response.body.accessibilityStats.rampaAcesso.positiveCount).toBe(3)
    expect(response.body.accessibilityStats.rampaAcesso.totalCount).toBe(3)

    expect(response.body.accessibilityStats.banheiroAcessivel.hasMajority).toBe(true)
    expect(response.body.accessibilityStats.banheiroAcessivel.percentage).toBe(66.67)
    expect(response.body.accessibilityStats.banheiroAcessivel.positiveCount).toBe(2)
    expect(response.body.accessibilityStats.banheiroAcessivel.totalCount).toBe(3)

    expect(response.body.accessibilityStats.estacionamentoAcessivel.hasMajority).toBe(true)
    expect(response.body.accessibilityStats.estacionamentoAcessivel.percentage).toBe(66.67)
    expect(response.body.accessibilityStats.estacionamentoAcessivel.positiveCount).toBe(2)
    expect(response.body.accessibilityStats.estacionamentoAcessivel.totalCount).toBe(3)

    expect(response.body.accessibilityStats.acessibilidadeVisual.hasMajority).toBe(true)
    expect(response.body.accessibilityStats.acessibilidadeVisual.percentage).toBe(66.67)
    expect(response.body.accessibilityStats.acessibilidadeVisual.positiveCount).toBe(2)
    expect(response.body.accessibilityStats.acessibilidadeVisual.totalCount).toBe(3)
  })

  test('should return accessibility stats for place with minority positive reports', async () => {
    // Criar relatos com maioria negativa para todos os campos
    await db.insert(reports).values([
      {
        id: randomUUID(),
        title: 'Relato 1',
        description: 'Descrição 1',
        type: 'accessibility',
        userId: testUser.id,
        placeId: testPlace.id,
        rampaAcesso: false,
        banheiroAcessivel: false,
        estacionamentoAcessivel: false,
        acessibilidadeVisual: false
      },
      {
        id: randomUUID(),
        title: 'Relato 2',
        description: 'Descrição 2',
        type: 'accessibility',
        userId: testUser.id,
        placeId: testPlace.id,
        rampaAcesso: false,
        banheiroAcessivel: false,
        estacionamentoAcessivel: false,
        acessibilidadeVisual: false
      },
      {
        id: randomUUID(),
        title: 'Relato 3',
        description: 'Descrição 3',
        type: 'accessibility',
        userId: testUser.id,
        placeId: testPlace.id,
        rampaAcesso: true,
        banheiroAcessivel: true,
        estacionamentoAcessivel: true,
        acessibilidadeVisual: true
      }
    ])

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/accessibility-stats`)

    expect(response.status).toBe(200)
    expect(response.body.totalReports).toBe(3)

    // Verificar estatísticas - maioria negativa (33.33% < 50%)
    expect(response.body.accessibilityStats.rampaAcesso.hasMajority).toBe(false)
    expect(response.body.accessibilityStats.rampaAcesso.percentage).toBe(33.33)
    expect(response.body.accessibilityStats.rampaAcesso.positiveCount).toBe(1)
    expect(response.body.accessibilityStats.rampaAcesso.totalCount).toBe(3)

    expect(response.body.accessibilityStats.banheiroAcessivel.hasMajority).toBe(false)
    expect(response.body.accessibilityStats.banheiroAcessivel.percentage).toBe(33.33)
    expect(response.body.accessibilityStats.banheiroAcessivel.positiveCount).toBe(1)
    expect(response.body.accessibilityStats.banheiroAcessivel.totalCount).toBe(3)

    expect(response.body.accessibilityStats.estacionamentoAcessivel.hasMajority).toBe(false)
    expect(response.body.accessibilityStats.estacionamentoAcessivel.percentage).toBe(33.33)
    expect(response.body.accessibilityStats.estacionamentoAcessivel.positiveCount).toBe(1)
    expect(response.body.accessibilityStats.estacionamentoAcessivel.totalCount).toBe(3)

    expect(response.body.accessibilityStats.acessibilidadeVisual.hasMajority).toBe(false)
    expect(response.body.accessibilityStats.acessibilidadeVisual.percentage).toBe(33.33)
    expect(response.body.accessibilityStats.acessibilidadeVisual.positiveCount).toBe(1)
    expect(response.body.accessibilityStats.acessibilidadeVisual.totalCount).toBe(3)
  })

  test('should return empty stats for place with no reports', async () => {
    const response = await request(server.server)
      .get(`/places/${testPlace.id}/accessibility-stats`)

    expect(response.status).toBe(200)
    expect(response.body.totalReports).toBe(0)

    // Todos os campos devem ter 0% e hasMajority false
    expect(response.body.accessibilityStats.rampaAcesso.hasMajority).toBe(false)
    expect(response.body.accessibilityStats.rampaAcesso.percentage).toBe(0)
    expect(response.body.accessibilityStats.rampaAcesso.positiveCount).toBe(0)
    expect(response.body.accessibilityStats.rampaAcesso.totalCount).toBe(0)

    expect(response.body.accessibilityStats.banheiroAcessivel.hasMajority).toBe(false)
    expect(response.body.accessibilityStats.banheiroAcessivel.percentage).toBe(0)
    expect(response.body.accessibilityStats.banheiroAcessivel.positiveCount).toBe(0)
    expect(response.body.accessibilityStats.banheiroAcessivel.totalCount).toBe(0)

    expect(response.body.accessibilityStats.estacionamentoAcessivel.hasMajority).toBe(false)
    expect(response.body.accessibilityStats.estacionamentoAcessivel.percentage).toBe(0)
    expect(response.body.accessibilityStats.estacionamentoAcessivel.positiveCount).toBe(0)
    expect(response.body.accessibilityStats.estacionamentoAcessivel.totalCount).toBe(0)

    expect(response.body.accessibilityStats.acessibilidadeVisual.hasMajority).toBe(false)
    expect(response.body.accessibilityStats.acessibilidadeVisual.percentage).toBe(0)
    expect(response.body.accessibilityStats.acessibilidadeVisual.positiveCount).toBe(0)
    expect(response.body.accessibilityStats.acessibilidadeVisual.totalCount).toBe(0)
  })

  test('should return 404 for non-existent place', async () => {
    const nonExistentId = randomUUID()
    
    const response = await request(server.server)
      .get(`/places/${nonExistentId}/accessibility-stats`)

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({
      message: 'Local não encontrado'
    })
  })

  test('should return 400 for invalid placeId format', async () => {
    const response = await request(server.server)
      .get('/places/invalid-uuid/accessibility-stats')

    expect(response.status).toBe(400)
  })

  test('should handle exactly 50% threshold correctly', async () => {
    // Criar exatamente 2 relatos com 1 positivo e 1 negativo (50%)
    await db.insert(reports).values([
      {
        id: randomUUID(),
        title: 'Relato 1',
        description: 'Descrição 1',
        type: 'accessibility',
        userId: testUser.id,
        placeId: testPlace.id,
        rampaAcesso: true,
        banheiroAcessivel: true,
        estacionamentoAcessivel: true,
        acessibilidadeVisual: true
      },
      {
        id: randomUUID(),
        title: 'Relato 2',
        description: 'Descrição 2',
        type: 'accessibility',
        userId: testUser.id,
        placeId: testPlace.id,
        rampaAcesso: false,
        banheiroAcessivel: false,
        estacionamentoAcessivel: false,
        acessibilidadeVisual: false
      }
    ])

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/accessibility-stats`)

    expect(response.status).toBe(200)
    expect(response.body.totalReports).toBe(2)

    // Com exatamente 50%, hasMajority deve ser false (não é > 50%)
    expect(response.body.accessibilityStats.rampaAcesso.hasMajority).toBe(false)
    expect(response.body.accessibilityStats.rampaAcesso.percentage).toBe(50)
    expect(response.body.accessibilityStats.rampaAcesso.positiveCount).toBe(1)
    expect(response.body.accessibilityStats.rampaAcesso.totalCount).toBe(2)
  })
})
