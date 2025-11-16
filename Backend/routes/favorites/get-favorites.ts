import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../../src/database/cliente'
import { favorites, places, reports, votes } from '../../src/database/schema'
import { eq, desc, count, inArray, sql } from 'drizzle-orm'
import { authenticateTokenWithError } from '../../src/middleware/auth'

export async function getFavoritesRoute(app: FastifyInstance) {
  app.get('/users/me/favorites', {
    preHandler: [authenticateTokenWithError],
    schema: {
      tags: ['Favorites'],
      summary: "Get User Favorites",
      description: "Busca todos os locais favoritos do usuário com contagem de comentários e votos.",
      querystring: z.object({
        page: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, "Página deve ser um número válido maior que 0").optional().default(1),
        limit: z.string().transform(Number).refine(val => !isNaN(val) && val > 0 && val <= 15, "Limite deve ser um número válido entre 1 e 15").optional().default(15),
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
            favoritedAt: z.date(),
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
      const userId = (request as any).user.id
      const { page, limit } = request.query as {
        page: number
        limit: number
      }

      const offset = (page - 1) * limit

      // Buscar favoritos do usuário
      const userFavorites = await db
        .select({
          placeId: favorites.placeId,
          favoritedAt: favorites.createdAt,
        })
        .from(favorites)
        .where(eq(favorites.userId, userId))
        .orderBy(desc(favorites.createdAt))
        .limit(limit)
        .offset(offset)

      // Buscar total de favoritos
      const totalFavoritesResult = await db
        .select({ count: count() })
        .from(favorites)
        .where(eq(favorites.userId, userId))

      const total = Number(totalFavoritesResult[0]?.count || 0)
      const totalPages = Math.ceil(total / limit)

      if (userFavorites.length === 0) {
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

      const placeIds = userFavorites.map(f => f.placeId)

      // Verificação de segurança para arrays vazios
      if (placeIds.length === 0) {
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

      // Buscar dados completos dos locais
      const placesData = await db
        .select()
        .from(places)
        .where(inArray(places.id, placeIds))

      // Buscar contagens agregadas de uma vez (otimizado)
      const [reportsCountsResult, votesCountsResult] = await Promise.all([
        db
          .select({
            placeId: reports.placeId,
            reportsCount: sql<number>`COUNT(*)::int`,
          })
          .from(reports)
          .where(inArray(reports.placeId, placeIds))
          .groupBy(reports.placeId),
        db
          .select({
            placeId: reports.placeId,
            votesCount: sql<number>`COUNT(${votes.id})::int`,
          })
          .from(reports)
          .leftJoin(votes, eq(votes.reportId, reports.id))
          .where(inArray(reports.placeId, placeIds))
          .groupBy(reports.placeId),
      ])

      // Criar mapas para acesso rápido
      const reportsCountsMap = new Map<string, number>()
      reportsCountsResult.forEach((row) => {
        reportsCountsMap.set(row.placeId, row.reportsCount)
      })

      const votesCountsMap = new Map<string, number>()
      votesCountsResult.forEach((row) => {
        votesCountsMap.set(row.placeId, row.votesCount || 0)
      })

      // Combinar dados
      const placesWithCounts = placesData.map((place) => {
        const favoriteData = userFavorites.find(f => f.placeId === place.id)
        const reportsCount = reportsCountsMap.get(place.id) || 0
        const votesCount = votesCountsMap.get(place.id) || 0

        return {
          ...place,
          reportsCount,
          votesCount,
          favoritedAt: favoriteData?.favoritedAt || place.createdAt,
        }
      })

      // Ordenar pela data de favoritado (mais recente primeiro)
      placesWithCounts.sort((a, b) => {
        const dateA = new Date(a.favoritedAt).getTime()
        const dateB = new Date(b.favoritedAt).getTime()
        return dateB - dateA
      })

      return reply.status(200).send({
        places: placesWithCounts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      })
    } catch (error) {
      console.error('Erro na rota get-favorites:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}

