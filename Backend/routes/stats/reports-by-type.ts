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

      // Consultas otimizadas: buscar tudo em paralelo
      const [reportsByTypeResult, totalResult, uniqueTypesResult] = await Promise.all([
        // Relatos agrupados por tipo (limitado)
        db
          .select({
            type: reports.type,
            count: count()
          })
          .from(reports)
          .groupBy(reports.type)
          .orderBy(desc(count()))
          .limit(limit),
        // Total de relatos
        db.select({ count: count() }).from(reports),
        // Tipos únicos (total, não limitado)
        db
          .selectDistinct({ type: reports.type })
          .from(reports)
      ])

      const total = totalResult[0].count
      const uniqueTypes = uniqueTypesResult.length

      // Calcular percentuais e formatar dados
      const data = reportsByTypeResult.map(item => ({
        type: item.type,
        count: item.count,
        percentage: total > 0 ? Number(((item.count / total) * 100).toFixed(2)) : 0
      }))

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
