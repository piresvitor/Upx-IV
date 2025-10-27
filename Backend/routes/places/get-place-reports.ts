import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { places, reports, users } from '../../src/database/schema.ts'
import { eq, sql } from 'drizzle-orm'
import z from 'zod'

export const getPlaceReportsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/places/:placeId/reports', {
    schema: {
      tags: ['Places'],
      summary: 'Get Place Reports',
      description: 'Retorna todos os relatos de acessibilidade para um local específico',
      params: z.object({
        placeId: z.string().uuid('ID do local deve ser um UUID válido')
      }),
      querystring: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(50).default(10),
      }),
      response: {
        200: z.object({
          place: z.object({
            id: z.string(),
            placeId: z.string(),
            name: z.string(),
            address: z.string().nullable(),
            latitude: z.number(),
            longitude: z.number(),
            types: z.array(z.string()),
            rating: z.number().nullable(),
            userRatingsTotal: z.number().nullable(),
            createdAt: z.date(),
            updatedAt: z.date()
          }),
          reports: z.array(z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            type: z.string(),
            createdAt: z.date(),
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string()
            }),
            rampaAcesso: z.boolean(),
            banheiroAcessivel: z.boolean(),
            estacionamentoAcessivel: z.boolean(),
            acessibilidadeVisual: z.boolean(),
          })),
          pagination: z.object({
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
          })
        }),
        404: z.object({
          message: z.string()
        }),
        500: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { placeId } = request.params as { placeId: string }
      const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number }

      // Verificar se o local existe
      const [place] = await db
        .select()
        .from(places)
        .where(eq(places.id, placeId))
        .limit(1)

      if (!place) {
        return reply.status(404).send({ message: 'Local não encontrado' })
      }

      // Total de relatos para paginação
      const totalResult = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(reports)
        .where(eq(reports.placeId, placeId))
      const total = totalResult[0]?.count ?? 0
      const totalPages = Math.max(1, Math.ceil(total / limit))

      // Buscar relatos do local com dados do usuário (paginado)
      const offset = (page - 1) * limit
      const placeReports = await db
        .select({
          id: reports.id,
          title: reports.title,
          description: reports.description,
          type: reports.type,
          createdAt: reports.createdAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email
          },
          rampaAcesso: reports.rampaAcesso,
          banheiroAcessivel: reports.banheiroAcessivel,
          estacionamentoAcessivel: reports.estacionamentoAcessivel,
          acessibilidadeVisual: reports.acessibilidadeVisual,
        })
        .from(reports)
        .innerJoin(users, eq(reports.userId, users.id))
        .where(eq(reports.placeId, placeId))
        .orderBy(sql`${reports.createdAt} DESC`)
        .limit(limit)
        .offset(offset)

      return reply.status(200).send({
        place: {
          id: place.id,
          placeId: place.placeId,
          name: place.name,
          address: place.address,
          latitude: place.latitude,
          longitude: place.longitude,
          types: place.types,
          rating: place.rating,
          userRatingsTotal: place.userRatingsTotal,
          createdAt: place.createdAt,
          updatedAt: place.updatedAt
        },
        reports: placeReports,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        }
      })

    } catch (error) {
      console.error('Erro ao buscar relatos do local:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}
