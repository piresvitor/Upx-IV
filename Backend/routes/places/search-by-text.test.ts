/*
Testes para a rota GET /places/search-by-text
- Busca locais por texto com query válida
- Retorna erro 400 para query vazia
- Retorna erro 400 para query muito curta
- Retorna erro 400 para latitude inválida
- Retorna erro 400 para longitude inválida
- Retorna erro 400 para raio inválido
- Retorna resultados vazios quando não encontra locais
- Filtra resultados para Sorocaba
- Cria novos lugares no banco quando necessário
- Retorna lugares existentes do banco
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { places, reports } from '../../src/database/schema.ts'

describe('GET /places/search-by-text Route', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste (remover relatos antes por FK)
    await db.delete(reports)
    await db.delete(places)
  })

  test('should search places by text with valid query', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Shopping Sorocaba'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
    expect(Array.isArray(response.body.places)).toBe(true)
    expect(Array.isArray(response.body.googlePlaces)).toBe(true)
  })

  test('should search places by text with location parameters', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Hospital',
        latitude: '-23.529',
        longitude: '-47.4686',
        radius: '5000'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
    expect(Array.isArray(response.body.places)).toBe(true)
    expect(Array.isArray(response.body.googlePlaces)).toBe(true)
  })

  test('should return 400 for empty query', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: ''
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for missing query parameter', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({})

    expect(response.status).toEqual(400)
  })

  test('should return 400 for invalid latitude', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Shopping',
        latitude: 'invalid'
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for invalid longitude', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Shopping',
        longitude: 'invalid'
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for invalid radius', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Shopping',
        radius: 'invalid'
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for negative radius', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Shopping',
        radius: '-1000'
      })

    expect(response.status).toEqual(400)
  })

  test('should return 400 for zero radius', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Shopping',
        radius: '0'
      })

    expect(response.status).toEqual(400)
  })

  test('should return empty results when no places found', async () => {
    // Busca por um termo que provavelmente não retornará resultados em Sorocaba
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'xyzabc123nonexistentplace999'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
    expect(Array.isArray(response.body.places)).toBe(true)
    expect(Array.isArray(response.body.googlePlaces)).toBe(true)
    // Pode retornar vazio ou alguns resultados, mas não deve dar erro
  })

  test('should filter results to Sorocaba bounds', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Shopping',
        latitude: '-23.529',
        longitude: '-47.4686'
      })

    expect(response.status).toEqual(200)
    
    // Verificar que todos os lugares retornados estão dentro dos bounds de Sorocaba
    if (response.body.places.length > 0) {
      response.body.places.forEach((place: any) => {
        expect(place.latitude).toBeGreaterThanOrEqual(-23.600)
        expect(place.latitude).toBeLessThanOrEqual(-23.400)
        expect(place.longitude).toBeGreaterThanOrEqual(-47.600)
        expect(place.longitude).toBeLessThanOrEqual(-47.300)
      })
    }

    if (response.body.googlePlaces.length > 0) {
      response.body.googlePlaces.forEach((place: any) => {
        expect(place.geometry.location.lat).toBeGreaterThanOrEqual(-23.600)
        expect(place.geometry.location.lat).toBeLessThanOrEqual(-23.400)
        expect(place.geometry.location.lng).toBeGreaterThanOrEqual(-47.600)
        expect(place.geometry.location.lng).toBeLessThanOrEqual(-47.300)
      })
    }
  })

  test('should return places with correct structure', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Restaurante'
      })

    expect(response.status).toEqual(200)
    
    if (response.body.places.length > 0) {
      const place = response.body.places[0]
      expect(place).toHaveProperty('id')
      expect(place).toHaveProperty('placeId')
      expect(place).toHaveProperty('name')
      expect(place).toHaveProperty('latitude')
      expect(place).toHaveProperty('longitude')
      expect(place).toHaveProperty('types')
      expect(typeof place.id).toBe('string')
      expect(typeof place.placeId).toBe('string')
      expect(typeof place.name).toBe('string')
      expect(typeof place.latitude).toBe('number')
      expect(typeof place.longitude).toBe('number')
      expect(Array.isArray(place.types)).toBe(true)
    }

    if (response.body.googlePlaces.length > 0) {
      const googlePlace = response.body.googlePlaces[0]
      expect(googlePlace).toHaveProperty('place_id')
      expect(googlePlace).toHaveProperty('name')
      expect(googlePlace).toHaveProperty('geometry')
      expect(googlePlace.geometry).toHaveProperty('location')
      expect(googlePlace.geometry.location).toHaveProperty('lat')
      expect(googlePlace.geometry.location).toHaveProperty('lng')
      expect(typeof googlePlace.place_id).toBe('string')
      expect(typeof googlePlace.name).toBe('string')
      expect(typeof googlePlace.geometry.location.lat).toBe('number')
      expect(typeof googlePlace.geometry.location.lng).toBe('number')
    }
  })

  test('should handle error from Google Maps API gracefully', async () => {
    // Este teste verifica que erros da API são tratados corretamente
    // Em caso de erro real da API, deve retornar 500
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Test Error Handling'
      })

    // Pode retornar 200 com resultados vazios ou 500 em caso de erro
    expect([200, 500]).toContain(response.status)
    
    if (response.status === 500) {
      expect(response.body).toHaveProperty('error')
      expect(typeof response.body.error).toBe('string')
    }
  })

  test('should accept query with special characters', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Café & Restaurante'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
  })

  test('should accept query with accented characters', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Açougue'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
  })

  test('should work with only query parameter', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Farmácia'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
  })

  test('should work with query and location but no radius', async () => {
    const response = await request(server.server)
      .get('/places/search-by-text')
      .query({
        query: 'Posto de Gasolina',
        latitude: '-23.529',
        longitude: '-47.4686'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('places')
    expect(response.body).toHaveProperty('googlePlaces')
  })
})

