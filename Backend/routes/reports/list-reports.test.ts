import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { users, reports, places } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'

describe('GET /reports (list with filters)', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  test('should list reports filtered by type and user_id with pagination', async () => {
    const [user] = await db.insert(users).values({ id: randomUUID(), name: 'U', email: `u-${Date.now()}@mail.com`, passwordHash: await hash('p') }).returning()
    const [place] = await db.insert(places).values({ id: randomUUID(), placeId: 'pl-' + Date.now(), name: 'P', latitude: -23, longitude: -46, types: ['x'] }).returning()

    await db.insert(reports).values([
      { id: randomUUID(), title: 'A', description: 'A', type: 'accessibility', userId: user.id, placeId: place.id },
      { id: randomUUID(), title: 'B', description: 'B', type: 'safety', userId: user.id, placeId: place.id },
      { id: randomUUID(), title: 'C', description: 'C', type: 'accessibility', userId: user.id, placeId: place.id },
    ])

    const res = await request(server.server)
      .get(`/reports?type=accessibility&user_id=${user.id}&page=1&limit=2`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.reports)).toBe(true)
    expect(res.body.reports.length).toBeLessThanOrEqual(2)
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 2 })
  })
})


