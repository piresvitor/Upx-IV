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
      // Consulta para obter o total de relatos
      const totalResult = await db.select({ count: count() }).from(reports)
      const total = totalResult[0].count

      // Consultas para contar cada característica de acessibilidade
      const [
        rampaAcessoResult,
        banheiroAcessivelResult,
        estacionamentoAcessivelResult,
        acessibilidadeVisualResult
      ] = await Promise.all([
        db.select({ count: count() }).from(reports).where(eq(reports.rampaAcesso, true)),
        db.select({ count: count() }).from(reports).where(eq(reports.banheiroAcessivel, true)),
        db.select({ count: count() }).from(reports).where(eq(reports.estacionamentoAcessivel, true)),
        db.select({ count: count() }).from(reports).where(eq(reports.acessibilidadeVisual, true))
      ])

      // Formatar dados com nomes em português
      const data = [
        {
          feature: 'Rampa de Acesso',
          count: rampaAcessoResult[0].count,
          percentage: total > 0 ? Number(((rampaAcessoResult[0].count / total) * 100).toFixed(2)) : 0
        },
        {
          feature: 'Banheiro Acessível',
          count: banheiroAcessivelResult[0].count,
          percentage: total > 0 ? Number(((banheiroAcessivelResult[0].count / total) * 100).toFixed(2)) : 0
        },
        {
          feature: 'Estacionamento Acessível',
          count: estacionamentoAcessivelResult[0].count,
          percentage: total > 0 ? Number(((estacionamentoAcessivelResult[0].count / total) * 100).toFixed(2)) : 0
        },
        {
          feature: 'Acessibilidade Visual',
          count: acessibilidadeVisualResult[0].count,
          percentage: total > 0 ? Number(((acessibilidadeVisualResult[0].count / total) * 100).toFixed(2)) : 0
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

