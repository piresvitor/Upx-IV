import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { users, reports, places, votes } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'

describe('GET /reports/:reportId', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    await db.delete(votes)
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  test('should return a report by id (200)', async () => {
    const [user] = await db.insert(users).values({
      id: randomUUID(),
      name: 'User A',
      email: `usera-${Date.now()}@mail.com`,
      passwordHash: await hash('password-123'),
    }).returning()

    const [place] = await db.insert(places).values({
      id: randomUUID(),
      placeId: 'place-abc-' + Date.now(),
      name: 'Place A',
      address: 'Rua A, 123',
      latitude: -23.55,
      longitude: -46.63,
      types: ['restaurant'],
    }).returning()

    const [report] = await db.insert(reports).values({
      id: randomUUID(),
      title: 'Relato 1',
      description: 'Desc 1',
      type: 'accessibility',
      userId: user.id,
      placeId: place.id,
      rampaAcesso: true,
      banheiroAcessivel: false,
      estacionamentoAcessivel: true,
      acessibilidadeVisual: false,
    }).returning()

    const res = await request(server.server)
      .get(`/reports/${report.id}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id: report.id, title: 'Relato 1' })
    expect(res.body.user).toMatchObject({ id: user.id, name: 'User A' })
    expect(res.body.place).toMatchObject({ id: place.id, name: 'Place A' })
    expect(res.body.rampaAcesso).toBe(true)
    expect(res.body.banheiroAcessivel).toBe(false)
    expect(res.body.estacionamentoAcessivel).toBe(true)
    expect(res.body.acessibilidadeVisual).toBe(false)
    expect(res.body.votesCount).toBe(0)
  })

  test('should return a report with votes count (200)', async () => {
    const [user1] = await db.insert(users).values({
      id: randomUUID(),
      name: 'User A',
      email: `usera-${Date.now()}@mail.com`,
      passwordHash: await hash('password-123'),
    }).returning()

    const [user2] = await db.insert(users).values({
      id: randomUUID(),
      name: 'User B',
      email: `userb-${Date.now()}@mail.com`,
      passwordHash: await hash('password-123'),
    }).returning()

    const [place] = await db.insert(places).values({
      id: randomUUID(),
      placeId: 'place-abc-' + Date.now(),
      name: 'Place A',
      address: 'Rua A, 123',
      latitude: -23.55,
      longitude: -46.63,
      types: ['restaurant'],
    }).returning()

    const [report] = await db.insert(reports).values({
      id: randomUUID(),
      title: 'Relato 1',
      description: 'Desc 1',
      type: 'accessibility',
      userId: user1.id,
      placeId: place.id,
      rampaAcesso: true,
      banheiroAcessivel: false,
      estacionamentoAcessivel: true,
      acessibilidadeVisual: false,
    }).returning()

    // Adicionar alguns votos
    await db.insert(votes).values([
      { userId: user1.id, reportId: report.id },
      { userId: user2.id, reportId: report.id },
    ])

    const res = await request(server.server)
      .get(`/reports/${report.id}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id: report.id, title: 'Relato 1' })
    expect(res.body.votesCount).toBe(2)
  })
})


