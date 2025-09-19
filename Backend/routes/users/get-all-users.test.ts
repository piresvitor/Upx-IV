import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { server } from '../../src/app.ts'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'
import { hash } from 'argon2'

describe('GET /users Route', () => {
  beforeEach(async () => {
    await server.ready()
    
    // Limpar e criar usuários de teste
    await db.delete(users)
    
    await db.insert(users).values([
      {
        name: 'João Silva',
        email: 'joao@example.com',
        passwordHash: await hash('password123'),
        role: 'user',
      },
      {
        name: 'Maria Santos',
        email: 'maria@example.com',
        passwordHash: await hash('password123'),
        role: 'admin',
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro@example.com',
        passwordHash: await hash('password123'),
        role: 'user',
      },
    ])
  })

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await db.delete(users)
  })

  it('should return all users with default pagination', async () => {
    const response = await request(server.server)
      .get('/users')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.users).toHaveLength(3)
    expect(responseData.pagination).toMatchObject({
      page: 1,
      limit: 10,
      total: 3,
      totalPages: 1,
    })
    
    // Verificar que não inclui passwordHash
    responseData.users.forEach((user: any) => {
      expect(user).not.toHaveProperty('passwordHash')
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('role')
    })
  })

  it('should return users with custom pagination', async () => {
    const response = await request(server.server)
      .get('/users?page=1&limit=2')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.users).toHaveLength(2)
    expect(responseData.pagination).toMatchObject({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2,
    })
  })

  it('should filter users by search term (name)', async () => {
    const response = await request(server.server)
      .get('/users?search=João')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.users).toHaveLength(1)
    expect(responseData.users[0].name).toBe('João Silva')
  })

  it('should filter users by search term (email)', async () => {
    const response = await request(server.server)
      .get('/users?search=maria@example.com')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.users).toHaveLength(1)
    expect(responseData.users[0].email).toBe('maria@example.com')
  })

  it('should filter users by role', async () => {
    const response = await request(server.server)
      .get('/users?role=admin')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.users).toHaveLength(1)
    expect(responseData.users[0].role).toBe('admin')
    expect(responseData.users[0].name).toBe('Maria Santos')
  })

  it('should sort users by name ascending', async () => {
    const response = await request(server.server)
      .get('/users?sortBy=name&sortOrder=asc')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.users[0].name).toBe('João Silva')
    expect(responseData.users[1].name).toBe('Maria Santos')
    expect(responseData.users[2].name).toBe('Pedro Oliveira')
  })

  it('should sort users by email descending', async () => {
    const response = await request(server.server)
      .get('/users?sortBy=email&sortOrder=desc')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.users[0].email).toBe('pedro@example.com')
    expect(responseData.users[1].email).toBe('maria@example.com')
    expect(responseData.users[2].email).toBe('joao@example.com')
  })

  it('should combine multiple filters', async () => {
    const response = await request(server.server)
      .get('/users?search=o&role=user&sortBy=name&sortOrder=asc')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.users).toHaveLength(2) // João e Pedro (ambos têm 'o' no nome e são 'user')
    expect(responseData.users[0].name).toBe('João Silva')
    expect(responseData.users[1].name).toBe('Pedro Oliveira')
  })

  it('should return 400 for invalid pagination parameters', async () => {
    const response = await request(server.server)
      .get('/users?page=0&limit=-1')

    expect(response.status).toBe(400)
  })

  it('should return 400 for invalid sort parameters', async () => {
    const response = await request(server.server)
      .get('/users?sortBy=invalid&sortOrder=invalid')

    expect(response.status).toBe(400)
  })

  it('should return 400 for invalid role parameter', async () => {
    const response = await request(server.server)
      .get('/users?role=invalid')

    expect(response.status).toBe(400)
  })

  it('should return empty result for non-matching search', async () => {
    const response = await request(server.server)
      .get('/users?search=inexistente')

    expect(response.status).toBe(200)
    const responseData = response.body
    expect(responseData.users).toHaveLength(0)
    expect(responseData.pagination.total).toBe(0)
  })
})
