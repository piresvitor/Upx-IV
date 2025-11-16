/*
Testes para a rota POST /places/:placeId/reports
- Cria relato com dados válidos
- Retorna erro 400 para dados inválidos
- Retorna erro 401 para token ausente
- Retorna erro 401 para token inválido
- Retorna erro 404 para local não encontrado
- Retorna erro 400 para campos obrigatórios ausentes
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, users, reports } from '../../src/database/schema.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import jwt from 'jsonwebtoken'

describe('POST /places/:placeId/reports Route', () => {
  let testUser: any
  let testPlace: any
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

    // Criar local de teste com placeId único
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
    
    testPlace = createdPlace
  })

  afterEach(async () => {
    // Não limpar o banco - usar banco de teste separado
  })

  test('should create report with valid data', async () => {
    const reportData = {
      title: 'Test Report',
      description: 'This is a test report description',
      type: 'positive',
      rampaAcesso: true,
      banheiroAcessivel: false,
      estacionamentoAcessivel: true,
      acessibilidadeVisual: false
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(201)
    expect(response.body).toHaveProperty('report')
    expect(response.body).toHaveProperty('message', 'Relato criado com sucesso')
    expect(response.body.report.title).toBe(reportData.title)
    expect(response.body.report.description).toBe(reportData.description)
    expect(response.body.report.type).toBe(reportData.type)
    expect(response.body.report.userId).toBe(testUser.id)
    expect(response.body.report.placeId).toBe(testPlace.id)
    expect(response.body.report.rampaAcesso).toBe(true)
    expect(response.body.report.banheiroAcessivel).toBe(false)
    expect(response.body.report.estacionamentoAcessivel).toBe(true)
    expect(response.body.report.acessibilidadeVisual).toBe(false)
  })

  test('should return 400 for missing title', async () => {
    const reportData = {
      description: 'This is a test report description',
      type: 'positive'
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(400)
  })

  test('should return 400 for empty title', async () => {
    const reportData = {
      title: '',
      description: 'This is a test report description',
      type: 'positive'
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(400)
  })

  test('should return 400 for title too long', async () => {
    const reportData = {
      title: 'A'.repeat(201), // Título muito longo (máximo 200)
      description: 'This is a test report description',
      type: 'positive'
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(400)
  })

  test('should return 400 for missing description', async () => {
    const reportData = {
      title: 'Test Report',
      type: 'positive'
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(400)
  })

  test('should return 400 for empty description', async () => {
    const reportData = {
      title: 'Test Report',
      description: '',
      type: 'positive'
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(400)
  })

  test('should return 400 for description too long', async () => {
    const reportData = {
      title: 'Test Report',
      description: 'A'.repeat(2001), // Descrição muito longa (máximo 2000)
      type: 'positive'
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(400)
  })

  test('should return 400 for missing type', async () => {
    const reportData = {
      title: 'Test Report',
      description: 'This is a test report description'
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(400)
  })

  test('should return 400 for empty type', async () => {
    const reportData = {
      title: 'Test Report',
      description: 'This is a test report description',
      type: ''
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(400)
  })

  test('should return 401 for missing authorization header', async () => {
    const reportData = {
      title: 'Test Report',
      description: 'This is a test report description',
      type: 'positive'
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .send(reportData)

    expect(response.status).toEqual(401)
  })

  test('should return 401 for invalid token', async () => {
    const reportData = {
      title: 'Test Report',
      description: 'This is a test report description',
      type: 'positive'
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', 'Bearer invalid-token')
      .send(reportData)

    expect(response.status).toEqual(401)
  })

  test('should return 404 for non-existent place', async () => {
    const reportData = {
      title: 'Test Report',
      description: 'This is a test report description',
      type: 'positive'
    }

    const nonExistentPlaceId = '00000000-0000-0000-0000-000000000000'

    const response = await request(server.server)
      .post(`/places/${nonExistentPlaceId}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(404)
    expect(response.body).toHaveProperty('error', 'Local não encontrado')
  })

  test('should return 400 for invalid placeId format', async () => {
    const reportData = {
      title: 'Test Report',
      description: 'This is a test report description',
      type: 'positive'
    }

    const response = await request(server.server)
      .post('/places/invalid-uuid/reports')
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(400)
  })

  test('should create report with default boolean values when not provided', async () => {
    const reportData = {
      title: 'Test Report',
      description: 'This is a test report description',
      type: 'positive'
    }

    const response = await request(server.server)
      .post(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(reportData)

    expect(response.status).toEqual(201)
    expect(response.body.report.rampaAcesso).toBe(false)
    expect(response.body.report.banheiroAcessivel).toBe(false)
    expect(response.body.report.estacionamentoAcessivel).toBe(false)
    expect(response.body.report.acessibilidadeVisual).toBe(false)
  })
})
