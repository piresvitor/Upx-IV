import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { reports, users, places } from '../../src/database/schema.ts'
import { and, desc, eq, like, sql } from 'drizzle-orm'
import z from 'zod'

export const listReportsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/reports', {
    schema: {
      tags: ['Reports'],
      summary: 'List Reports',
      querystring: z.object({
        type: z.string().optional(),
        user_id: z.string().uuid().optional(),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(50).default(10),
      }),
      response: {
        200: z.object({
          reports: z.array(z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            type: z.string(),
            createdAt: z.date(),
            user: z.object({ id: z.string(), name: z.string(), email: z.string() }),
            place: z.object({ id: z.string(), name: z.string() }).nullable(),
          })),
          pagination: z.object({
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
          })
        }),
        500: z.object({ message: z.string() })
      }
    }
  }, async (request, reply) => {
    try {
      const { type, user_id, page = 1, limit = 10 } = request.query as { type?: string; user_id?: string; page: number; limit: number }

      const conditions = [] as any[]
      if (type) conditions.push(eq(reports.type, type))
      if (user_id) conditions.push(eq(reports.userId, user_id))
      const whereExpr = conditions.length > 0 ? and(...conditions) : undefined

      const totalQuery = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(reports)
        .where(whereExpr as any)
      const total = totalQuery[0]?.count ?? 0
      const totalPages = Math.max(1, Math.ceil(total / limit))
      const offset = (page - 1) * limit

      const data = await db
        .select({
          id: reports.id,
          title: reports.title,
          description: reports.description,
          type: reports.type,
          createdAt: reports.createdAt,
          userId: users.id,
          userName: users.name,
          userEmail: users.email,
          placeId: places.id,
          placeName: places.name,
        })
        .from(reports)
        .innerJoin(users, eq(reports.userId, users.id))
        .leftJoin(places, eq(reports.placeId, places.id))
        .where(whereExpr as any)
        .orderBy(desc(reports.createdAt))
        .limit(limit)
        .offset(offset)

      const reportsFormatted = data.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        createdAt: row.createdAt,
        user: { id: row.userId, name: row.userName, email: row.userEmail },
        place: row.placeId ? { id: row.placeId, name: row.placeName! } : null,
      }))

      return reply.status(200).send({
        reports: reportsFormatted,
        pagination: { page, limit, total, totalPages }
      })
    } catch (error) {
      console.error('Erro ao listar relatos:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}


