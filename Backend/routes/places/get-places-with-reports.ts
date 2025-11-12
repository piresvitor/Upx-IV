import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../../src/database/cliente'
import { places, reports, votes } from '../../src/database/schema'
import { desc, asc, ilike, and, or, count, eq, sql, inArray, arrayContains } from 'drizzle-orm'

export async function getPlacesWithReportsRoute(app: FastifyInstance) {
  app.get('/places/with-reports', {
    schema: {
      tags: ['Places'],
      summary: "Get Places With Reports",
      description: "Busca todos os locais que possuem comentários, com contagem de comentários e votos.",
      querystring: z.object({
        page: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, "Página deve ser um número válido maior que 0").optional().default(1),
        limit: z.string().transform(Number).refine(val => !isNaN(val) && val > 0 && val <= 15, "Limite deve ser um número válido entre 1 e 15").optional().default(15),
        search: z.string().optional(),
        type: z.string().optional(),
        sortBy: z.enum(['reportsCount', 'votesCount', 'createdAt']).optional().default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
      }),
      response: {
        200: z.object({
          places: z.array(z.object({
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
            updatedAt: z.date(),
            reportsCount: z.number(),
            votesCount: z.number(),
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
      const { page, limit, search, type, sortBy, sortOrder } = request.query as {
        page: number
        limit: number
        search?: string
        type?: string
        sortBy: 'reportsCount' | 'votesCount' | 'createdAt'
        sortOrder: 'asc' | 'desc'
      }

      const offset = (page - 1) * limit

      // Construir condições de filtro
      const conditions = []
      
      if (search) {
        conditions.push(
          or(
            ilike(places.name, `%${search}%`),
            ilike(places.address, `%${search}%`)
          )
        )
      }

      if (type) {
        conditions.push(arrayContains(places.types, [type]))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Buscar todos os locais com relatórios que atendem aos filtros
      // Primeiro, vamos buscar os IDs únicos dos locais com relatórios
      const placesWithReportsIdsQuery = db
        .select({ id: places.id })
        .from(places)
        .innerJoin(reports, eq(reports.placeId, places.id))
        .where(whereClause)
        .groupBy(places.id)

      const allPlacesWithReportsIds = await placesWithReportsIdsQuery
      const allPlaceIds = allPlacesWithReportsIds.map(p => p.id)
      
      if (allPlaceIds.length === 0) {
        return reply.status(200).send({
          places: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        })
      }

      // Buscar os dados completos dos locais
      const placesData = await db
        .select()
        .from(places)
        .where(inArray(places.id, allPlaceIds))

      // Para cada local, buscar contagem de relatórios e votos
      const placesWithCounts = await Promise.all(
        placesData.map(async (place) => {
          // Contar relatórios
          const reportsResult = await db
            .select({ count: count() })
            .from(reports)
            .where(eq(reports.placeId, place.id))

          const reportsCount = reportsResult[0]?.count || 0

          // Contar votos de todos os relatórios deste local
          const votesResult = await db
            .select({ count: count() })
            .from(votes)
            .innerJoin(reports, eq(reports.id, votes.reportId))
            .where(eq(reports.placeId, place.id))

          const votesCount = votesResult[0]?.count || 0

          return {
            ...place,
            reportsCount,
            votesCount,
          }
        })
      )

      // Aplicar ordenação
      placesWithCounts.sort((a, b) => {
        let comparison = 0
        
        switch (sortBy) {
          case 'reportsCount':
            comparison = a.reportsCount - b.reportsCount
            break
          case 'votesCount':
            comparison = a.votesCount - b.votesCount
            break
          case 'createdAt':
          default:
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            break
        }
        
        return sortOrder === 'asc' ? comparison : -comparison
      })

      // Aplicar paginação após ordenação
      const paginatedPlaces = placesWithCounts.slice(offset, offset + limit)

      // Contar total de locais com relatórios
      const totalResult = await db
        .select({
          total: sql<number>`count(distinct ${places.id})`.as('total'),
        })
        .from(places)
        .innerJoin(reports, eq(reports.placeId, places.id))
        .where(whereClause)

      const total = placesWithCounts.length
      const totalPages = Math.ceil(total / limit)

      return reply.status(200).send({
        places: paginatedPlaces,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      })
    } catch (error) {
      console.error('Erro no serviço de busca de locais com relatórios:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}

