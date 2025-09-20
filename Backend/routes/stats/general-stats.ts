import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente'
import { users, reports, places, votes } from '../../src/database/schema'
import { count } from 'drizzle-orm'
import { z } from 'zod'

export const generalStatsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/stats/general', {
    schema: {
      tags: ['Statistics'],
      summary: 'General Statistics',
      description: 'Retorna estatísticas gerais da plataforma: total de usuários, relatos e locais',
      response: {
        200: z.object({
          totalUsers: z.number(),
          totalReports: z.number(),
          totalPlaces: z.number(),
          totalVotes: z.number(),
          lastUpdated: z.date()
        }),
        500: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      // Executar todas as consultas em paralelo para melhor performance
      const [
        usersResult,
        reportsResult,
        placesResult,
        votesResult
      ] = await Promise.all([
        db.select({ count: count() }).from(users),
        db.select({ count: count() }).from(reports),
        db.select({ count: count() }).from(places),
        db.select({ count: count() }).from(votes)
      ])

      const stats = {
        totalUsers: usersResult[0].count,
        totalReports: reportsResult[0].count,
        totalPlaces: placesResult[0].count,
        totalVotes: votesResult[0].count,
        lastUpdated: new Date()
      }

      return reply.status(200).send(stats)
    } catch (error) {
      console.error('Erro ao buscar estatísticas gerais:', error)
      return reply.status(500).send({ 
        message: 'Erro interno do servidor' 
      })
    }
  })
}
