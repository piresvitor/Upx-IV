import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { users, reports } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'
import jwt from 'jsonwebtoken'

describe('PUT /reports/:reportId', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    await db.delete(reports)
    await db.delete(users)
  })

  test('should update a report when requested by its author (200)', async () => {
    const [user] = await db.insert(users).values({
      id: randomUUID(),
      name: 'Author',
      email: `author-${Date.now()}@mail.com`,
      passwordHash: await hash('password-123'),
      role: 'user'
    }).returning()

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'test-secret')

    const [report] = await db.insert(reports).values({
      id: randomUUID(),
      title: 'Old',
      description: 'Old Desc',
      type: 'accessibility',
      userId: user.id,
      rampaAcesso: false,
      banheiroAcessivel: false,
      estacionamentoAcessivel: false,
      acessibilidadeVisual: false,
    }).returning()

    const res = await request(server.server)
      .put(`/reports/${report.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Title' })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ message: 'Relato atualizado com sucesso' })
  })

  test('should return 403 when non-author tries to update', async () => {
    const [author] = await db.insert(users).values({
      id: randomUUID(), name: 'Author', email: `a-${Date.now()}@mail.com`, passwordHash: await hash('x')
    }).returning()
    const [intruder] = await db.insert(users).values({
      id: randomUUID(), name: 'Intruder', email: `i-${Date.now()}@mail.com`, passwordHash: await hash('y')
    }).returning()

    const token = jwt.sign({ sub: intruder.id, role: intruder.role }, process.env.JWT_SECRET || 'test-secret')

    const [report] = await db.insert(reports).values({
      id: randomUUID(), 
      title: 'T', 
      description: 'D', 
      type: 'accessibility', 
      userId: author.id,
      rampaAcesso: false,
      banheiroAcessivel: false,
      estacionamentoAcessivel: false,
      acessibilidadeVisual: false,
    }).returning()

    const res = await request(server.server)
      .put(`/reports/${report.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' })

    expect(res.status).toBe(403)
  })

  test('should update boolean fields when provided', async () => {
    const [user] = await db.insert(users).values({
      id: randomUUID(),
      name: 'Author',
      email: `author-${Date.now()}@mail.com`,
      passwordHash: await hash('password-123'),
      role: 'user'
    }).returning()

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'test-secret')

    const [report] = await db.insert(reports).values({
      id: randomUUID(),
      title: 'Test Report',
      description: 'Test Description',
      type: 'accessibility',
      userId: user.id,
      rampaAcesso: false,
      banheiroAcessivel: false,
      estacionamentoAcessivel: false,
      acessibilidadeVisual: false,
    }).returning()

    const res = await request(server.server)
      .put(`/reports/${report.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        rampaAcesso: true,
        banheiroAcessivel: true,
        estacionamentoAcessivel: true,
        acessibilidadeVisual: true
      })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ message: 'Relato atualizado com sucesso' })
  })
})


