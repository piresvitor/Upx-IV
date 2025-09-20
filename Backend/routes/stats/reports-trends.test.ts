import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { users, reports, places } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'

describe('GET /stats/reports/trends', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  test('should return daily trends with default parameters', async () => {
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

    // Criar relatos com datas diferentes
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    await db.insert(reports).values([
      { 
        id: randomUUID(), 
        title: 'Report 1', 
        description: 'Description 1', 
        type: 'accessibility', 
        userId: user.id, 
        placeId: place.id,
        createdAt: today
      },
      { 
        id: randomUUID(), 
        title: 'Report 2', 
        description: 'Description 2', 
        type: 'safety', 
        userId: user.id, 
        placeId: place.id,
        createdAt: today
      },
      { 
        id: randomUUID(), 
        title: 'Report 3', 
        description: 'Description 3', 
        type: 'accessibility', 
        userId: user.id, 
        placeId: place.id,
        createdAt: yesterday
      }
    ])

    const response = await request(server.server)
      .get('/stats/reports/trends')

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('period', 'day')
    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('total', 3)
    expect(response.body).toHaveProperty('lastUpdated')
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data.length).toBeGreaterThan(0)
    
    // Verificar se os dados têm a estrutura correta
    response.body.data.forEach((item: any) => {
      expect(item).toHaveProperty('date')
      expect(item).toHaveProperty('count')
      expect(typeof item.count).toBe('number')
    })
  })

  test('should return weekly trends when period=week', async () => {
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
      .get('/stats/reports/trends?period=week')

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('period', 'week')
    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('total', 1)
  })

  test('should return monthly trends when period=month', async () => {
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
      .get('/stats/reports/trends?period=month')

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('period', 'month')
    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('total', 1)
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

    // Criar múltiplos relatos
    for (let i = 0; i < 5; i++) {
      await db.insert(reports).values({ 
        id: randomUUID(), 
        title: `Report ${i}`, 
        description: `Description ${i}`, 
        type: 'accessibility', 
        userId: user.id, 
        placeId: place.id
      })
    }

    const response = await request(server.server)
      .get('/stats/reports/trends?limit=3')

    expect(response.status).toEqual(200)
    expect(response.body.data.length).toBeLessThanOrEqual(3)
  })

  test('should return 400 for invalid period', async () => {
    const response = await request(server.server)
      .get('/stats/reports/trends?period=invalid')

    expect(response.status).toEqual(400)
    expect(response.body).toHaveProperty('message')
  })

  test('should return empty data when no reports exist', async () => {
    const response = await request(server.server)
      .get('/stats/reports/trends')

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('period', 'day')
    expect(response.body).toHaveProperty('data', [])
    expect(response.body).toHaveProperty('total', 0)
  })
})
