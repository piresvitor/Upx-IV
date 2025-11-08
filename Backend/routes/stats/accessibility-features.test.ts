import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { reports, places, users } from '../../src/database/schema.ts'
import { randomUUID } from 'crypto'
import { hash } from 'argon2'
import { makeUser } from '../../src/tests/factories/make-user.ts'

describe('GET /stats/reports/accessibility-features', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await db.delete(reports)
    await db.delete(places)
    await db.delete(users)
  })

  test('should return accessibility features statistics with correct structure', async () => {
    const { user } = await makeUser()
    
    // Criar um local de teste
    const placeId = randomUUID()
    await db.insert(places).values({
      id: placeId,
      placeId: 'test-place-id',
      name: 'Local de Teste',
      address: 'Endereço de Teste',
      latitude: -23.5505,
      longitude: -46.6333,
      types: ['restaurant']
    })

    // Criar relatos com diferentes características de acessibilidade
    await db.insert(reports).values([
      {
        id: randomUUID(),
        title: 'Relato 1',
        description: 'Descrição 1',
        type: 'accessibility',
        userId: user.id,
        placeId: placeId,
        rampaAcesso: true,
        banheiroAcessivel: true,
        estacionamentoAcessivel: false,
        acessibilidadeVisual: false
      },
      {
        id: randomUUID(),
        title: 'Relato 2',
        description: 'Descrição 2',
        type: 'accessibility',
        userId: user.id,
        placeId: placeId,
        rampaAcesso: true,
        banheiroAcessivel: false,
        estacionamentoAcessivel: true,
        acessibilidadeVisual: true
      },
      {
        id: randomUUID(),
        title: 'Relato 3',
        description: 'Descrição 3',
        type: 'accessibility',
        userId: user.id,
        placeId: placeId,
        rampaAcesso: false,
        banheiroAcessivel: false,
        estacionamentoAcessivel: false,
        acessibilidadeVisual: false
      }
    ])

    const response = await request(server.server)
      .get('/stats/reports/accessibility-features')

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('total')
    expect(response.body).toHaveProperty('lastUpdated')
    
    // Verificar estrutura dos dados
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data.length).toBe(4)
    
    // Verificar se todas as características estão presentes
    const features = response.body.data.map((item: any) => item.feature)
    expect(features).toContain('Rampa de Acesso')
    expect(features).toContain('Banheiro Acessível')
    expect(features).toContain('Estacionamento Acessível')
    expect(features).toContain('Acessibilidade Visual')
    
    // Verificar estrutura de cada item
    response.body.data.forEach((item: any) => {
      expect(item).toHaveProperty('feature')
      expect(item).toHaveProperty('count')
      expect(item).toHaveProperty('percentage')
      expect(typeof item.feature).toBe('string')
      expect(typeof item.count).toBe('number')
      expect(typeof item.percentage).toBe('number')
      expect(item.count).toBeGreaterThanOrEqual(0)
      expect(item.percentage).toBeGreaterThanOrEqual(0)
      expect(item.percentage).toBeLessThanOrEqual(100)
    })
    
    // Verificar valores específicos
    const rampaAcesso = response.body.data.find((item: any) => item.feature === 'Rampa de Acesso')
    expect(rampaAcesso.count).toBe(2) // 2 relatos com rampaAcesso = true
    expect(rampaAcesso.percentage).toBeCloseTo(66.67, 1) // 2/3 * 100
    
    const banheiroAcessivel = response.body.data.find((item: any) => item.feature === 'Banheiro Acessível')
    expect(banheiroAcessivel.count).toBe(1) // 1 relato com banheiroAcessivel = true
    expect(banheiroAcessivel.percentage).toBeCloseTo(33.33, 1) // 1/3 * 100
    
    expect(response.body.total).toBe(3)
  })

  test('should return zero statistics when no reports exist', async () => {
    const response = await request(server.server)
      .get('/stats/reports/accessibility-features')

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('total')
    expect(response.body.total).toBe(0)
    
    // Verificar se todas as características retornam zero
    response.body.data.forEach((item: any) => {
      expect(item.count).toBe(0)
      expect(item.percentage).toBe(0)
    })
  })

  test('should return correct percentages for all features', async () => {
    const { user } = await makeUser()
    
    // Criar um local de teste
    const placeId = randomUUID()
    await db.insert(places).values({
      id: placeId,
      placeId: 'test-place-id-2',
      name: 'Local de Teste 2',
      address: 'Endereço de Teste 2',
      latitude: -23.5505,
      longitude: -46.6333,
      types: ['restaurant']
    })

    // Criar 10 relatos, todos com todas as características
    const reportsToInsert = Array.from({ length: 10 }, () => ({
      id: randomUUID(),
      title: 'Relato',
      description: 'Descrição',
      type: 'accessibility',
      userId: user.id,
      placeId: placeId,
      rampaAcesso: true,
      banheiroAcessivel: true,
      estacionamentoAcessivel: true,
      acessibilidadeVisual: true
    }))

    await db.insert(reports).values(reportsToInsert)

    const response = await request(server.server)
      .get('/stats/reports/accessibility-features')

    expect(response.status).toEqual(200)
    expect(response.body.total).toBe(10)
    
    // Todas as características devem ter 100%
    response.body.data.forEach((item: any) => {
      expect(item.count).toBe(10)
      expect(item.percentage).toBe(100)
    })
  })
})
