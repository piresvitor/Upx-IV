import { describe, test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, reports, users } from '../../src/database/schema.ts'
import { hash } from 'argon2'
import { randomUUID } from 'crypto'

describe('GET /places/:placeId/reports', () => {
  test('should return reports for an existing place (200)', async () => {
    await server.ready()
    const userPassword = await hash('password-test')

    const [user] = await db.insert(users).values({
      id: randomUUID(),
      name: 'Test User',
      email: `test-${Math.random()}@example.com`,
      passwordHash: userPassword,
      role: 'user',
    }).returning()

    const [place] = await db.insert(places).values({
      id: randomUUID(),
      placeId: `gplace_${Math.random()}`,
      name: 'Test Place',
      address: 'Rua Teste, 123',
      latitude: -23.0,
      longitude: -46.0,
      types: ['restaurant'],
      rating: 4.2,
      userRatingsTotal: 10,
    }).returning()

    await db.insert(reports).values([
      {
        id: randomUUID(),
        title: 'Rampa de acesso',
        description: 'Existe rampa de acesso na entrada',
        type: 'positive',
        userId: user.id,
        placeId: place.id,
      },
      {
        id: randomUUID(),
        title: 'Banheiro acessível',
        description: 'Banheiro adaptado disponível',
        type: 'positive',
        userId: user.id,
        placeId: place.id,
      },
    ])

    const response = await request(server.server)
      .get(`/places/${place.id}/reports?page=1&limit=2`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('place')
    expect(response.body.place).toMatchObject({ id: place.id, name: 'Test Place' })
    expect(Array.isArray(response.body.reports)).toBe(true)
    expect(response.body.reports.length).toBeLessThanOrEqual(2)
    expect(response.body).toHaveProperty('pagination')
    expect(response.body.pagination).toMatchObject({ page: 1, limit: 2 })

    // cleanup
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })
})


