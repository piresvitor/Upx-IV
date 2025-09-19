/*
Testes para a rota GET /places/:placeId/reports
- Busca relatos com paginação
- Retorna relatos com informações do usuário e votos
- Retorna erro 404 para local não encontrado
- Retorna erro 400 para placeId inválido
- Testa paginação com diferentes parâmetros
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, users, reports, votes } from '../../src/database/schema.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import jwt from 'jsonwebtoken'

describe('GET /places/:placeId/reports Route', () => {
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
    // Limpar dados de teste após cada teste
    await db.delete(votes)
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  test('should get reports with default pagination', async () => {
    // Criar alguns relatos de teste
    const reportData = [
      {
        title: 'Report 1',
        description: 'Description 1',
        type: 'safety',
        userId: testUser.id,
        placeId: testPlace.id
      },
      {
        title: 'Report 2',
        description: 'Description 2',
        type: 'quality',
        userId: testUser.id,
        placeId: testPlace.id
      }
    ]

    await db.insert(reports).values(reportData)

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/reports`)

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('reports')
    expect(response.body).toHaveProperty('pagination')
    expect(Array.isArray(response.body.reports)).toBe(true)
    expect(response.body.reports).toHaveLength(2)
    expect(response.body.pagination).toHaveProperty('page', 1)
    expect(response.body.pagination).toHaveProperty('limit', 10)
    expect(response.body.pagination).toHaveProperty('total', 2)
    expect(response.body.pagination).toHaveProperty('totalPages', 1)
  })

  test('should get reports with custom pagination', async () => {
    // Criar 5 relatos de teste
    const reportData = Array.from({ length: 5 }, (_, i) => ({
      title: `Report ${i + 1}`,
      description: `Description ${i + 1}`,
      type: 'safety',
      userId: testUser.id,
      placeId: testPlace.id
    }))

    await db.insert(reports).values(reportData)

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/reports`)
      .query({
        page: 2,
        limit: 2
      })

    expect(response.status).toEqual(200)
    expect(response.body.reports).toHaveLength(2)
    expect(response.body.pagination).toHaveProperty('page', 2)
    expect(response.body.pagination).toHaveProperty('limit', 2)
    expect(response.body.pagination).toHaveProperty('total', 5)
    expect(response.body.pagination).toHaveProperty('totalPages', 3)
  })

  test('should return reports with user information', async () => {
    const reportData = {
      title: 'Test Report',
      description: 'Test Description',
      type: 'safety',
      userId: testUser.id,
      placeId: testPlace.id
    }

    await db.insert(reports).values(reportData)

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/reports`)

    expect(response.status).toEqual(200)
    expect(response.body.reports).toHaveLength(1)
    expect(response.body.reports[0]).toHaveProperty('user')
    expect(response.body.reports[0].user).toHaveProperty('id', testUser.id)
    expect(response.body.reports[0].user).toHaveProperty('name', testUser.name)
  })

  test('should return reports list', async () => {
    const [createdReport] = await db.insert(reports).values({
      title: 'Test Report',
      description: 'Test Description',
      type: 'safety',
      userId: testUser.id,
      placeId: testPlace.id
    }).returning()

    // Criar alguns votos (apenas um por usuário)
    await db.insert(votes).values({
      userId: testUser.id,
      reportId: createdReport.id
    })

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/reports`)

    expect(response.status).toEqual(200)
    expect(response.body.reports).toHaveLength(1)
    expect(Array.isArray(response.body.reports)).toBe(true)
  })

  test('should return pagination object', async () => {
    const [createdReport] = await db.insert(reports).values({
      title: 'Test Report',
      description: 'Test Description',
      type: 'safety',
      userId: testUser.id,
      placeId: testPlace.id
    }).returning()

    // Criar voto do usuário
    await db.insert(votes).values({
      userId: testUser.id,
      reportId: createdReport.id
    })

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body.reports).toHaveLength(1)
    expect(response.body).toHaveProperty('pagination')
  })

  test('should return place info with reports', async () => {
    await db.insert(reports).values({
      title: 'Test Report',
      description: 'Test Description',
      type: 'safety',
      userId: testUser.id,
      placeId: testPlace.id
    })

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/reports`)
      .set('Authorization', `Bearer ${validToken}`)

    expect(response.status).toEqual(200)
    expect(response.body.reports).toHaveLength(1)
    expect(response.body).toHaveProperty('place')
  })

  test('should not include userVoted when no token provided', async () => {
    await db.insert(reports).values({
      title: 'Test Report',
      description: 'Test Description',
      type: 'safety',
      userId: testUser.id,
      placeId: testPlace.id
    })

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/reports`)

    expect(response.status).toEqual(200)
    expect(response.body.reports).toHaveLength(1)
    expect(response.body.reports[0]).not.toHaveProperty('userVoted')
  })

  test('should return empty array when no reports exist', async () => {
    const response = await request(server.server)
      .get(`/places/${testPlace.id}/reports`)

    expect(response.status).toEqual(200)
    expect(response.body.reports).toHaveLength(0)
    expect(response.body.pagination).toHaveProperty('total', 0)
    expect(response.body.pagination.totalPages).toBeGreaterThanOrEqual(1)
  })

  test('should return 404 for non-existent place', async () => {
    const nonExistentPlaceId = '00000000-0000-0000-0000-000000000000'

    const response = await request(server.server)
      .get(`/places/${nonExistentPlaceId}/reports`)

    expect(response.status).toEqual(404)
    expect(response.body).toHaveProperty('message', 'Local não encontrado')
  })

  test('should return 400 for invalid placeId format', async () => {
    const response = await request(server.server)
      .get('/places/invalid-uuid/reports')

    expect(response.status).toEqual(400)
  })

  test('should handle invalid pagination parameters gracefully', async () => {
    const response = await request(server.server)
      .get(`/places/${testPlace.id}/reports`)
      .query({
        page: 'invalid',
        limit: 'invalid'
      })

    // Deve retornar erro 400 para parâmetros inválidos
    expect(response.status).toEqual(400)
  })

  test('should order reports by creation date (newest first)', async () => {
    // Criar relatos com datas diferentes
    const reportData = [
      {
        title: 'Old Report',
        description: 'Old Description',
        type: 'safety',
        userId: testUser.id,
        placeId: testPlace.id,
        createdAt: new Date('2023-01-01')
      },
      {
        title: 'New Report',
        description: 'New Description',
        type: 'quality',
        userId: testUser.id,
        placeId: testPlace.id,
        createdAt: new Date('2023-12-31')
      }
    ]

    await db.insert(reports).values(reportData)

    const response = await request(server.server)
      .get(`/places/${testPlace.id}/reports`)

    expect(response.status).toEqual(200)
    expect(response.body.reports).toHaveLength(2)
    // O relato mais recente deve vir primeiro
    expect(response.body.reports[0].title).toBe('New Report')
    expect(response.body.reports[1].title).toBe('Old Report')
  })
})
