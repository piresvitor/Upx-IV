import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { users, reports } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'
import jwt from 'jsonwebtoken'

describe('DELETE /reports/:reportId', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    await db.delete(reports)
    await db.delete(users)
  })

  test('should delete a report when requested by its author (200)', async () => {
    const [user] = await db.insert(users).values({
      id: randomUUID(), name: 'Author', email: `author-${Date.now()}@mail.com`, passwordHash: await hash('p')
    }).returning()

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'test-secret')

    const [report] = await db.insert(reports).values({
      id: randomUUID(), title: 'T', description: 'D', type: 'accessibility', userId: user.id
    }).returning()

    const res = await request(server.server)
      .delete(`/reports/${report.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ message: 'Relato removido com sucesso' })
  })

  test('should return 403 when non-author tries to delete', async () => {
    const [author] = await db.insert(users).values({ id: randomUUID(), name: 'A', email: `a-${Date.now()}@mail.com`, passwordHash: await hash('x') }).returning()
    const [intruder] = await db.insert(users).values({ id: randomUUID(), name: 'I', email: `i-${Date.now()}@mail.com`, passwordHash: await hash('y') }).returning()

    const token = jwt.sign({ sub: intruder.id, role: intruder.role }, process.env.JWT_SECRET || 'test-secret')

    const [report] = await db.insert(reports).values({ id: randomUUID(), title: 'T', description: 'D', type: 'accessibility', userId: author.id }).returning()

    const res = await request(server.server)
      .delete(`/reports/${report.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(403)
  })
})


