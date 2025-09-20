import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente'
import { reports } from '../../src/database/schema'
import { count, desc } from 'drizzle-orm'
import { z } from 'zod'

export const reportsByTypeRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/stats/reports/by-type', {
    schema: {
      tags: ['Statistics'],
      summary: 'Reports by Type',
      description: 'Retorna estatísticas de relatos agrupados por tipo',
      querystring: z.object({
        limit: z.coerce.number().min(1).max(100).default(20).describe('Número máximo de tipos a retornar')
      }),
      response: {
        200: z.object({
          data: z.array(z.object({
            type: z.string(),
            count: z.number(),
            percentage: z.number()
          })),
          total: z.number(),
          uniqueTypes: z.number(),
          lastUpdated: z.date()
        }),
        500: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { limit } = request.query as { limit: number }

      // Consulta para obter relatos agrupados por tipo
      const reportsByType = await db
        .select({
          type: reports.type,
          count: count()
        })
        .from(reports)
        .groupBy(reports.type)
        .orderBy(desc(count()))
        .limit(limit)

      // Consulta para obter o total de relatos
      const totalResult = await db.select({ count: count() }).from(reports)
      const total = totalResult[0].count

      // Calcular percentuais e formatar dados
      const data = reportsByType.map(item => ({
        type: item.type,
        count: item.count,
        percentage: total > 0 ? Number(((item.count / total) * 100).toFixed(2)) : 0
      }))

      // Contar tipos únicos (total, não limitado)
      const uniqueTypesResult = await db
        .select({ count: count() })
        .from(reports)
        .groupBy(reports.type)
      
      const uniqueTypes = uniqueTypesResult.length

      return reply.status(200).send({
        data,
        total,
        uniqueTypes,
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Erro ao buscar relatos por tipo:', error)
      return reply.status(500).send({ 
        message: 'Erro interno do servidor' 
      })
    }
  })
}
