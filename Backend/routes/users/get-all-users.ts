import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../../src/database/cliente'
import { users } from '../../src/database/schema'
import { desc, asc, ilike, and, or, count, eq } from 'drizzle-orm'

export async function getAllUsersRoute(app: FastifyInstance) {
  app.get('/users', {
    schema: {
      tags: ['Users'],
      summary: "Get All Users",
      description: "Busca todos os usuários com filtros e paginação.",
      querystring: z.object({
        page: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, "Página deve ser um número válido maior que 0").optional().default(1),
        limit: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, "Limite deve ser um número válido maior que 0").optional().default(10),
        search: z.string().optional(),
        role: z.enum(['user', 'admin']).optional(),
        sortBy: z.enum(['name', 'email']).optional().default('name'),
        sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
      }),
      response: {
        200: z.object({
          users: z.array(z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.enum(['user', 'admin']),
          })),
          pagination: z.object({
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
          }),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    try {
      const { page, limit, search, role, sortBy, sortOrder } = request.query as {
        page: number
        limit: number
        search?: string
        role?: 'user' | 'admin'
        sortBy: 'name' | 'email'
        sortOrder: 'asc' | 'desc'
      }

      const offset = (page - 1) * limit

      // Construir condições de filtro
      const conditions = []
      
      if (search) {
        conditions.push(
          or(
            ilike(users.name, `%${search}%`),
            ilike(users.email, `%${search}%`)
          )
        )
      }

      if (role) {
        conditions.push(eq(users.role, role))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Construir ordenação
      let orderBy
      switch (sortBy) {
        case 'name':
          orderBy = sortOrder === 'asc' ? asc(users.name) : desc(users.name)
          break
        case 'email':
        default:
          orderBy = sortOrder === 'asc' ? asc(users.email) : desc(users.email)
          break
      }

      // Buscar usuários (sem incluir passwordHash)
      const usersData = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)

      // Contar total
      const [{ total }] = await db
        .select({ total: count() })
        .from(users)
        .where(whereClause)

      const totalPages = Math.ceil(total / limit)

      return reply.status(200).send({
        users: usersData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      })
    } catch (error) {
      console.error('Erro na rota get-all-users:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
