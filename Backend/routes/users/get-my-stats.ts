import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { reports, votes, favorites, places } from '../../src/database/schema.ts'
import { eq, count, sql, desc, inArray } from 'drizzle-orm'
import z from 'zod'
import { authenticateToken } from '../../src/middleware/auth.ts'
import { FastifyRequest } from 'fastify'

export const getMyStatsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/users/me/stats', {
    preHandler: authenticateToken,
    schema: {
      tags: ['Users'],
      summary: 'Get User Stats',
      description: 'Retorna estatísticas do usuário autenticado: total de relatórios, votos recebidos, favoritos e lista de relatórios com contagem de votos',
      headers: z.object({
        authorization: z.string().regex(/^Bearer .+/, 'Authorization header must be Bearer token')
      }),
      querystring: z.object({
        reportsLimit: z.coerce.number().int().min(1).max(50).optional().default(50),
      }),
      response: {
        200: z.object({
          totalReports: z.number(),
          totalVotes: z.number(),
          totalFavorites: z.number(),
          reports: z.array(z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            type: z.string(),
            createdAt: z.date(),
            place: z.object({ id: z.string(), name: z.string() }).nullable(),
            votesCount: z.number(),
          })),
        }),
        500: z.object({
          message: z.string()
        })
      }
    }
  }, async (request: FastifyRequest, reply) => {
    try {
      const userId = (request as any).user.id
      const { reportsLimit } = request.query as { reportsLimit: number }

      // Executar consultas de contagem em paralelo
      const [
        reportsCountResult,
        totalVotesResult,
        favoritesCountResult,
        userReportsResult
      ] = await Promise.all([
        // Contar total de relatórios do usuário
        db
          .select({ count: count() })
          .from(reports)
          .where(eq(reports.userId, userId)),
        
        // Contar total de votos recebidos (soma de todos os votos em todos os relatórios do usuário)
        db
          .select({ 
            totalVotes: sql<number>`COUNT(*)::int`,
          })
          .from(votes)
          .innerJoin(reports, eq(votes.reportId, reports.id))
          .where(eq(reports.userId, userId)),
        
        // Contar total de favoritos do usuário
        db
          .select({ count: count() })
          .from(favorites)
          .where(eq(favorites.userId, userId)),
        
        // Buscar relatórios do usuário com informações do local
        db
          .select({
            id: reports.id,
            title: reports.title,
            description: reports.description,
            type: reports.type,
            createdAt: reports.createdAt,
            placeId: places.id,
            placeName: places.name,
          })
          .from(reports)
          .leftJoin(places, eq(reports.placeId, places.id))
          .where(eq(reports.userId, userId))
          .orderBy(desc(reports.createdAt))
          .limit(reportsLimit)
      ])

      const totalReports = reportsCountResult[0]?.count || 0
      const totalVotes = totalVotesResult[0]?.totalVotes || 0
      const totalFavorites = favoritesCountResult[0]?.count || 0

      // Buscar contagem de votos para cada relatório retornado (após obter os IDs)
      let votesCountsMap = new Map<string, number>()
      if (userReportsResult.length > 0) {
        const reportIds = userReportsResult.map(r => r.id)
        const votesCountsResult = await db
          .select({
            reportId: votes.reportId,
            votesCount: sql<number>`COUNT(*)::int`,
          })
          .from(votes)
          .where(inArray(votes.reportId, reportIds))
          .groupBy(votes.reportId)
        
        votesCountsResult.forEach((row) => {
          votesCountsMap.set(row.reportId, row.votesCount)
        })
      }

      // Formatar relatórios com contagem de votos
      const reportsFormatted = userReportsResult.map((report) => ({
        id: report.id,
        title: report.title,
        description: report.description,
        type: report.type,
        createdAt: report.createdAt,
        place: report.placeId ? { id: report.placeId, name: report.placeName! } : null,
        votesCount: votesCountsMap.get(report.id) || 0,
      }))

      return reply.status(200).send({
        totalReports,
        totalVotes,
        totalFavorites,
        reports: reportsFormatted,
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas do usuário:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}

