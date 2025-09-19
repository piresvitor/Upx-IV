/*
Testes para a rota POST /reports/:reportId/votes
- Cria voto com dados válidos
- Retorna erro 401 para token ausente
- Retorna erro 401 para token inválido
- Retorna erro 404 para relato não encontrado
- Retorna erro 409 para voto duplicado
- Retorna erro 400 para reportId inválido
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, users, reports, votes } from '../../src/database/schema.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import jwt from 'jsonwebtoken'

describe('POST /reports/:reportId/votes Route', () => {
  let testUser: any
  let testReport: any
  let validToken: string

  beforeEach(async () => {
    await server.ready()
    
    // Criar usuário de teste
    const { user } = await makeUser()
    testUser = user

    // Criar token válido
    validToken = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET || 'test-secret'
    )

    // Criar local de teste
    const uniquePlaceId = `ChIJN1t_tDeuEmsRUsoyG83frY4_${Date.now()}`
    const [createdPlace] = await db.insert(places).values({
      placeId: uniquePlaceId,
      name: 'Test Place',
      address: 'Test Address',
      latitude: -23.5505,
      longitude: -46.6333,
      types: ['restaurant'],
      rating: 4.5,
      userRatingsTotal: 100
    }).returning()

    // Criar relato de teste
    const [createdReport] = await db.insert(reports).values({
      title: 'Test Report',
      description: 'This is a test report description',
      type: 'safety',
      userId: user.id,
      placeId: createdPlace.id
    }).returning()
    
    testReport = createdReport
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await db.delete(votes)
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  test('should create vote with valid data', async () => {
    const response = await request(server.server)
      .post(`/reports/${testReport.id}/votes`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(201)
    expect(response.body).toHaveProperty('message', 'Voto criado com sucesso')
    expect(response.body).toHaveProperty('vote')
    expect(response.body.vote.userId).toBe(testUser.id)
    expect(response.body.vote.reportId).toBe(testReport.id)
    expect(response.body.vote).toHaveProperty('id')
    expect(response.body.vote).toHaveProperty('createdAt')
  })

  test('should return 401 for missing authorization header', async () => {
    const response = await request(server.server)
      .post(`/reports/${testReport.id}/votes`)

    expect(response.status).toEqual(401)
  })

  test('should return 401 for invalid token', async () => {
    const response = await request(server.server)
      .post(`/reports/${testReport.id}/votes`)
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toEqual(401)
  })

  test('should return 404 for non-existent report', async () => {
    const nonExistentReportId = '00000000-0000-0000-0000-000000000000'

    const response = await request(server.server)
      .post(`/reports/${nonExistentReportId}/votes`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(404)
    expect(response.body).toHaveProperty('message', 'Relato não encontrado')
  })

  test('should return 409 for duplicate vote', async () => {
    // Criar primeiro voto
    await request(server.server)
      .post(`/reports/${testReport.id}/votes`)
      .set('Authorization', `Bearer ${validToken}`)

    // Tentar criar segundo voto
    const response = await request(server.server)
      .post(`/reports/${testReport.id}/votes`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(409)
    expect(response.body).toHaveProperty('message', 'Você já votou neste relato')
  })

  test('should return 400 for invalid reportId format', async () => {
    const response = await request(server.server)
      .post('/reports/invalid-uuid/votes')
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(400)
  })
})
