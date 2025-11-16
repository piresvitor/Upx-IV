import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente'
import { reports } from '../../src/database/schema'
import { count, sql } from 'drizzle-orm'
import { z } from 'zod'

export const reportsTrendsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/stats/reports/trends', {
    schema: {
      tags: ['Statistics'],
      summary: 'Reports Trends',
      description: 'Retorna tendências de relatos ao longo do tempo (por dia, semana ou mês)',
      querystring: z.object({
        period: z.enum(['day', 'week', 'month']).default('day').describe('Período de agrupamento: day, week ou month'),
        limit: z.coerce.number().min(1).max(365).default(30).describe('Número de períodos a retornar (máximo 365)')
      }),
      response: {
        200: z.object({
          period: z.string(),
          data: z.array(z.object({
            date: z.string(),
            count: z.number()
          })),
          total: z.number(),
          lastUpdated: z.date()
        }),
        400: z.object({
          message: z.string()
        }),
        500: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { period, limit } = request.query as { period: 'day' | 'week' | 'month', limit: number }

      let dateFormat: string

      switch (period) {
        case 'day':
          dateFormat = 'YYYY-MM-DD'
          break
        case 'week':
          dateFormat = 'YYYY-"W"WW'
          break
        case 'month':
          dateFormat = 'YYYY-MM'
          break
        default:
          return reply.status(400).send({ 
            message: 'Período inválido. Use: day, week ou month' 
          })
      }

      // Consulta para obter tendências agrupadas por período usando SQL raw
      // Retornar dados em UTC (sem conversão de timezone)
      // A conversão deve ser feita no frontend
      // O dateFormat já é validado pelo Zod enum, então é seguro
      const validFormats = {
        'day': 'YYYY-MM-DD',
        'week': 'YYYY-"W"WW',
        'month': 'YYYY-MM'
      }
      const safeDateFormat = validFormats[period] || 'YYYY-MM-DD'
      
      const trendsResult = await db.execute(sql.raw(`
        SELECT 
          to_char(created_at AT TIME ZONE 'UTC', '${safeDateFormat}') as date,
          COUNT(*)::int as count
        FROM reports 
        WHERE created_at IS NOT NULL
          AND created_at <= NOW()
        GROUP BY to_char(created_at AT TIME ZONE 'UTC', '${safeDateFormat}')
        ORDER BY to_char(created_at AT TIME ZONE 'UTC', '${safeDateFormat}') DESC
        LIMIT ${limit}
      `))

      // Consulta para obter o total de relatos
      const totalResult = await db.select({ count: count() }).from(reports)
      const total = totalResult[0].count

      // Converter o resultado para o formato esperado
      const trends = trendsResult.rows.map((row: any) => ({
        date: row.date,
        count: parseInt(row.count)
      }))

      // Inverter a ordem para mostrar do mais antigo para o mais recente
      const sortedTrends = trends.reverse()

      return reply.status(200).send({
        period,
        data: sortedTrends,
        total,
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Erro ao buscar tendências de relatos:', error)
      return reply.status(500).send({ 
        message: 'Erro interno do servidor' 
      })
    }
  })
}