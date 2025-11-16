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
        sortBy: z.enum(['reportsCount', 'votesCount', 'createdAt', 'lastReportDate']).optional().default('lastReportDate'),
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
            lastReportDate: z.date().optional(),
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
        sortBy: 'reportsCount' | 'votesCount' | 'createdAt' | 'lastReportDate'
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

      // Buscar total primeiro (para paginação) - otimizado
      // O innerJoin já garante que placeId não é nulo, mas vamos adicionar verificação explícita
      const totalWhereConditions: any[] = []
      if (whereClause) {
        totalWhereConditions.push(whereClause)
      }
      
      const totalResult = await db
        .select({
          total: sql<number>`COUNT(DISTINCT ${places.id})`,
        })
        .from(places)
        .innerJoin(reports, eq(reports.placeId, places.id))
        .where(totalWhereConditions.length > 0 ? and(...totalWhereConditions) : undefined)

      const total = Number(totalResult[0]?.total || 0)
      const totalPages = Math.ceil(total / limit)

      if (total === 0) {
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

      // Buscar IDs dos locais que atendem aos filtros
      // O innerJoin já garante que placeId não é nulo
      const placesWithReportsIds = await db
        .select({ id: places.id })
        .from(places)
        .innerJoin(reports, eq(reports.placeId, places.id))
        .where(whereClause)

      // Remover duplicatas usando Set (pode haver múltiplos relatórios por local)
      const allPlaceIds = Array.from(new Set(placesWithReportsIds.map(p => p.id)))

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

      // Buscar dados dos locais
      const placesData = await db
        .select()
        .from(places)
        .where(inArray(places.id, allPlaceIds))

      // Buscar contagens agregadas de uma vez (otimizado)

      const [reportsCountsResult, votesCountsResult] = await Promise.all([
        db
          .select({
            placeId: reports.placeId,
            reportsCount: sql<number>`COUNT(*)::int`,
            lastReportDate: sql<Date>`MAX(${reports.createdAt})`,
          })
          .from(reports)
          .where(inArray(reports.placeId, allPlaceIds))
          .groupBy(reports.placeId),
        db
          .select({
            placeId: reports.placeId,
            votesCount: sql<number>`COUNT(${votes.id})::int`,
          })
          .from(reports)
          .leftJoin(votes, eq(votes.reportId, reports.id))
          .where(inArray(reports.placeId, allPlaceIds))
          .groupBy(reports.placeId),
      ])

      // Criar mapas para acesso rápido
      const reportsCountsMap = new Map<string, { count: number; lastDate: Date }>()
      reportsCountsResult.forEach((row) => {
        if (row.placeId) {
          // Garantir que lastReportDate seja uma Date válida
          let lastDate: Date
          if (row.lastReportDate instanceof Date) {
            lastDate = row.lastReportDate
          } else if (row.lastReportDate) {
            lastDate = new Date(row.lastReportDate)
          } else {
            lastDate = new Date()
          }
          
          reportsCountsMap.set(row.placeId, {
            count: Number(row.reportsCount) || 0,
            lastDate
          })
        }
      })

      const votesCountsMap = new Map<string, number>()
      votesCountsResult.forEach((row) => {
        if (row.placeId) {
          votesCountsMap.set(row.placeId, Number(row.votesCount) || 0)
        }
      })

      // Combinar dados
      const placesWithCounts = placesData.map((place) => {
        const reportData = reportsCountsMap.get(place.id) || { count: 0, lastDate: place.createdAt }
        const votesCount = votesCountsMap.get(place.id) || 0

        return {
          ...place,
          reportsCount: reportData.count,
          votesCount,
          lastReportDate: reportData.lastDate,
        }
      })

      // Aplicar ordenação
      const orderDirection = sortOrder === 'asc' ? 1 : -1
      placesWithCounts.sort((a, b) => {
        let comparison = 0
        
        switch (sortBy) {
          case 'reportsCount':
            comparison = a.reportsCount - b.reportsCount
            break
          case 'votesCount':
            comparison = a.votesCount - b.votesCount
            break
          case 'lastReportDate':
            comparison = new Date(a.lastReportDate).getTime() - new Date(b.lastReportDate).getTime()
            break
          case 'createdAt':
          default:
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            break
        }
        
        return comparison * orderDirection
      })

      // Aplicar paginação
      const paginatedPlaces = placesWithCounts.slice(offset, offset + limit)

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

