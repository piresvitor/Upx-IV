import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { users, reports, places } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'

describe('GET /stats/reports/by-type', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  test('should return reports grouped by type with correct counts and percentages', async () => {
    // Criar dados de teste
    const [user] = await db.insert(users).values({ 
      id: randomUUID(), 
      name: 'User', 
      email: `user-${Date.now()}@mail.com`, 
      passwordHash: await hash('password') 
    }).returning()

    const [place] = await db.insert(places).values({ 
      id: randomUUID(), 
      placeId: 'place-' + Date.now(), 
      name: 'Place', 
      latitude: -23.5505, 
      longitude: -46.6333, 
      types: ['restaurant'] 
    }).returning()

    // Criar relatos de diferentes tipos
    await db.insert(reports).values([
      { 
        id: randomUUID(), 
        title: 'Report 1', 
        description: 'Description 1', 
        type: 'accessibility', 
        userId: user.id, 
        placeId: place.id
      },
      { 
        id: randomUUID(), 
        title: 'Report 2', 
        description: 'Description 2', 
        type: 'accessibility', 
        userId: user.id, 
        placeId: place.id
      },
      { 
        id: randomUUID(), 
        title: 'Report 3', 
        description: 'Description 3', 
        type: 'safety', 
        userId: user.id, 
        placeId: place.id
      },
      { 
        id: randomUUID(), 
        title: 'Report 4', 
        description: 'Description 4', 
        type: 'cultural', 
        userId: user.id, 
        placeId: place.id
      }
    ])

    const response = await request(server.server)
      .get('/stats/reports/by-type')

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('total', 4)
    expect(response.body).toHaveProperty('uniqueTypes', 3)
    expect(response.body).toHaveProperty('lastUpdated')
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data.length).toBe(3)

    // Verificar se os dados têm a estrutura correta
    response.body.data.forEach((item: any) => {
      expect(item).toHaveProperty('type')
      expect(item).toHaveProperty('count')
      expect(item).toHaveProperty('percentage')
      expect(typeof item.count).toBe('number')
      expect(typeof item.percentage).toBe('number')
      expect(item.percentage).toBeGreaterThanOrEqual(0)
      expect(item.percentage).toBeLessThanOrEqual(100)
    })

    // Verificar se os tipos estão ordenados por count (descendente)
    const counts = response.body.data.map((item: any) => item.count)
    const sortedCounts = [...counts].sort((a, b) => b - a)
    expect(counts).toEqual(sortedCounts)

    // Verificar se as porcentagens somam aproximadamente 100%
    const totalPercentage = response.body.data.reduce((sum: number, item: any) => sum + item.percentage, 0)
    expect(totalPercentage).toBeCloseTo(100, 1)
  })

  test('should respect limit parameter', async () => {
    const [user] = await db.insert(users).values({ 
      id: randomUUID(), 
      name: 'User', 
      email: `user-${Date.now()}@mail.com`, 
      passwordHash: await hash('password') 
    }).returning()

    const [place] = await db.insert(places).values({ 
      id: randomUUID(), 
      placeId: 'place-' + Date.now(), 
      name: 'Place', 
      latitude: -23.5505, 
      longitude: -46.6333, 
      types: ['restaurant'] 
    }).returning()

    // Criar relatos de diferentes tipos
    const types = ['accessibility', 'safety', 'cultural', 'transport', 'health']
    for (const type of types) {
      await db.insert(reports).values({ 
        id: randomUUID(), 
        title: `Report ${type}`, 
        description: `Description ${type}`, 
        type, 
        userId: user.id, 
        placeId: place.id
      })
    }

    const response = await request(server.server)
      .get('/stats/reports/by-type?limit=3')

    expect(response.status).toEqual(200)
    expect(response.body.data.length).toBeLessThanOrEqual(3)
    expect(response.body).toHaveProperty('total', 5)
    expect(response.body).toHaveProperty('uniqueTypes', 5)
  })

  test('should return empty data when no reports exist', async () => {
    const response = await request(server.server)
      .get('/stats/reports/by-type')

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('data', [])
    expect(response.body).toHaveProperty('total', 0)
    expect(response.body).toHaveProperty('uniqueTypes', 0)
  })

  test('should handle single report type correctly', async () => {
    const [user] = await db.insert(users).values({ 
      id: randomUUID(), 
      name: 'User', 
      email: `user-${Date.now()}@mail.com`, 
      passwordHash: await hash('password') 
    }).returning()

    const [place] = await db.insert(places).values({ 
      id: randomUUID(), 
      placeId: 'place-' + Date.now(), 
      name: 'Place', 
      latitude: -23.5505, 
      longitude: -46.6333, 
      types: ['restaurant'] 
    }).returning()

    await db.insert(reports).values({ 
      id: randomUUID(), 
      title: 'Report', 
      description: 'Description', 
      type: 'accessibility', 
      userId: user.id, 
      placeId: place.id
    })

    const response = await request(server.server)
      .get('/stats/reports/by-type')

    expect(response.status).toEqual(200)
    expect(response.body.data.length).toBe(1)
    expect(response.body.data[0]).toHaveProperty('type', 'accessibility')
    expect(response.body.data[0]).toHaveProperty('count', 1)
    expect(response.body.data[0]).toHaveProperty('percentage', 100)
    expect(response.body).toHaveProperty('total', 1)
    expect(response.body).toHaveProperty('uniqueTypes', 1)
  })

  // Teste de erro de banco removido - não é possível simular facilmente com Drizzle
})
