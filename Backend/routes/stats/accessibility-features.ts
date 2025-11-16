import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente'
import { reports } from '../../src/database/schema'
import { count, sql, eq } from 'drizzle-orm'
import { z } from 'zod'

export const accessibilityFeaturesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/stats/reports/accessibility-features', {
    schema: {
      tags: ['Statistics'],
      summary: 'Accessibility Features Statistics',
      description: 'Retorna estatísticas de características de acessibilidade dos relatos',
      response: {
        200: z.object({
          data: z.array(z.object({
            feature: z.string(),
            count: z.number(),
            percentage: z.number()
          })),
          total: z.number(),
          lastUpdated: z.date()
        }),
        500: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
  
      const result = await db.execute(sql`
        SELECT 
          COUNT(*)::int as total,
          COUNT(*) FILTER (WHERE rampa_acesso = true)::int as rampa_acesso,
          COUNT(*) FILTER (WHERE banheiro_acessivel = true)::int as banheiro_acessivel,
          COUNT(*) FILTER (WHERE estacionamento_acessivel = true)::int as estacionamento_acessivel,
          COUNT(*) FILTER (WHERE acessibilidade_visual = true)::int as acessibilidade_visual
        FROM reports
      `)
      
      const row = result.rows[0] as any
      const total = row.total

      // Formatar dados com nomes em português
      const data = [
        {
          feature: 'Rampa de Acesso',
          count: row.rampa_acesso,
          percentage: total > 0 ? Number(((row.rampa_acesso / total) * 100).toFixed(2)) : 0
        },
        {
          feature: 'Banheiro Acessível',
          count: row.banheiro_acessivel,
          percentage: total > 0 ? Number(((row.banheiro_acessivel / total) * 100).toFixed(2)) : 0
        },
        {
          feature: 'Estacionamento Acessível',
          count: row.estacionamento_acessivel,
          percentage: total > 0 ? Number(((row.estacionamento_acessivel / total) * 100).toFixed(2)) : 0
        },
        {
          feature: 'Acessibilidade Visual',
          count: row.acessibilidade_visual,
          percentage: total > 0 ? Number(((row.acessibilidade_visual / total) * 100).toFixed(2)) : 0
        }
      ]

      return reply.status(200).send({
        data,
        total,
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas de acessibilidade:', error)
      return reply.status(500).send({ 
        message: 'Erro interno do servidor' 
      })
    }
  })
}

