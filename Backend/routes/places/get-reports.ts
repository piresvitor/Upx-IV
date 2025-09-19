import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../../src/database/cliente'
import { reports, users, votes } from '../../src/database/schema'
import { placesService } from '../../src/services/places'
import { eq, desc, count, and } from 'drizzle-orm'
import { authenticateToken } from '../../src/middleware/auth'

export async function getReportsRoute(app: FastifyInstance) {
  app.get('/places/:placeId/reports', {
    preHandler: async (request, reply) => {
      // Middleware de autenticação opcional
      const authHeader = request.headers.authorization
      if (authHeader) {
        try {
          const token = authHeader.replace('Bearer ', '')
          if (process.env.JWT_SECRET) {
            const jwt = require('jsonwebtoken')
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
            request.user = {
              id: decoded.sub || decoded.id,
              role: decoded.role
            }
          }
        } catch (error) {
          // Se o token for inválido, continua sem autenticação
        }
      }
    },
    schema: {
      tags: ['Places'],
      summary: "Get Reports",
      description: "Busca todos os relatos de um local específico com paginação.",
      params: z.object({
        placeId: z.string().uuid(),
      }),
      querystring: z.object({
        page: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, "Página deve ser um número válido maior que 0").optional().default(1),
        limit: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, "Limite deve ser um número válido maior que 0").optional().default(10),
      }),
      response: {
        200: z.object({
          reports: z.array(z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            type: z.string(),
            createdAt: z.date(),
            user: z.object({
              id: z.string(),
              name: z.string(),
            }),
            votesCount: z.number(),
            userVoted: z.boolean().optional(),
          })),
          pagination: z.object({
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
          }),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    try {
      const { placeId } = request.params as { placeId: string }
      const { page, limit } = request.query as { page: number; limit: number }
      const userId = request.user?.id // Pode ser undefined se não autenticado

      // Verifica se o local existe
      const place = await placesService.findById(placeId)
      if (!place) {
        return reply.status(404).send({
          error: 'Local não encontrado',
        })
      }

      const offset = (page - 1) * limit

      // Busca os relatos com informações do usuário e contagem de votos
      const reportsData = await db
        .select({
          id: reports.id,
          title: reports.title,
          description: reports.description,
          type: reports.type,
          createdAt: reports.createdAt,
          user: {
            id: users.id,
            name: users.name,
          },
        })
        .from(reports)
        .innerJoin(users, eq(reports.userId, users.id))
        .where(eq(reports.placeId, placeId))
        .orderBy(desc(reports.createdAt))
        .limit(limit)
        .offset(offset)

      // Conta o total de relatos
      const [{ total }] = await db
        .select({ total: count() })
        .from(reports)
        .where(eq(reports.placeId, placeId))

      // Para cada relato, busca a contagem de votos
      const reportsWithVotes = await Promise.all(
        reportsData.map(async (report) => {
          const [{ votesCount }] = await db
            .select({ votesCount: count() })
            .from(votes)
            .where(eq(votes.reportId, report.id))

          let userVoted = false
          if (userId) {
            const userVote = await db
              .select()
              .from(votes)
              .where(and(eq(votes.reportId, report.id), eq(votes.userId, userId)))
              .limit(1)
            userVoted = userVote.length > 0
          }

          return {
            ...report,
            votesCount,
            userVoted,
          }
        })
      )

      const totalPages = Math.ceil(total / limit)

      return reply.status(200).send({
        reports: reportsWithVotes,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      })
    } catch (error) {
      console.error('Erro na rota get-reports:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
