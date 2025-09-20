/*
6 testes implementados:
PUT /users/me com dados válidos - Atualiza perfil com sucesso
PUT /users/me sem campos - Retorna 400
PUT /users/me com email duplicado - Retorna 409
PUT /users/me sem token - Retorna 400
PUT /users/me com token inválido - Retorna 401
PUT /users/me com email inválido - Retorna 400
*/

import { expect, test, describe, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { makeUser } from '../../src/tests/factories/make-user.ts'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'
import jwt from 'jsonwebtoken'

describe('PUT /users/me Route', () => {
  beforeEach(async () => {
    await server.ready()
  })

  afterEach(async () => {
    // Não limpar o banco - usar banco de teste separado
  })

  test('should update user profile with valid data', async () => {
    const { user } = await makeUser()
    
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const updateData = {
      name: 'Novo Nome',
      email: 'novo@email.com'
    }

    const response = await request(server.server)
      .put('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)

    expect(response.status).toEqual(200)
    expect(response.body.message).toBe('Perfil atualizado com sucesso')
    expect(response.body.user.name).toBe(updateData.name)
    expect(response.body.user.email).toBe(updateData.email)
    expect(response.body.user.id).toBe(user.id)
  })

  test('should return 400 when no fields provided', async () => {
    const { user } = await makeUser()
    
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .put('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(response.status).toEqual(400)
    expect(response.body.message).toBe('Pelo menos um campo deve ser fornecido para atualização')
  })

  test('should return 409 for duplicate email', async () => {
    const { user: user1 } = await makeUser()
    const { user: user2 } = await makeUser()
    
    const token = jwt.sign(
      { sub: user1.id, role: user1.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .put('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: user2.email })

    expect(response.status).toEqual(409)
    expect(response.body.message).toBe('Email já está sendo usado por outro usuário')
  })

  test('should return 400 for missing authorization header', async () => {
    const response = await request(server.server)
      .put('/users/me')
      .send({ name: 'Test' })

    expect(response.status).toEqual(400)
  })

  test('should return 401 for invalid token', async () => {
    const response = await request(server.server)
      .put('/users/me')
      .set('Authorization', 'Bearer invalid-token')
      .send({ name: 'Test' })

    expect(response.status).toEqual(401)
    expect(response.body.message).toBe('Token inválido ou expirado')
  })

  test('should return 400 for invalid email format', async () => {
    const { user } = await makeUser()
    
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .put('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'invalid-email' })

    expect(response.status).toEqual(400)
  })

  test('should update password successfully', async () => {
    const { user } = await makeUser()
    
    const token = jwt.sign(
      { sub: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'test-secret'
    )

    const response = await request(server.server)
      .put('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'newpassword123' })

    expect(response.status).toEqual(200)
    expect(response.body.message).toBe('Perfil atualizado com sucesso')
  })
})
