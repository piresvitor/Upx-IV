import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../../src/database/cliente'
import { reports, places } from '../../src/database/schema'
import { eq, and, sql } from 'drizzle-orm'

export async function getPlaceAccessibilityStats(app: FastifyInstance) {
  app.get('/places/:placeId/accessibility-stats', {
    schema: {
      params: z.object({
        placeId: z.string().uuid('ID do local deve ser um UUID válido')
      }),
      response: {
        200: z.object({
          place: z.object({
            id: z.string(),
            name: z.string(),
            address: z.string()
          }),
          totalReports: z.number(),
          accessibilityStats: z.object({
            rampaAcesso: z.object({
              percentage: z.number(),
              hasMajority: z.boolean(),
              positiveCount: z.number(),
              totalCount: z.number()
            }),
            banheiroAcessivel: z.object({
              percentage: z.number(),
              hasMajority: z.boolean(),
              positiveCount: z.number(),
              totalCount: z.number()
            }),
            estacionamentoAcessivel: z.object({
              percentage: z.number(),
              hasMajority: z.boolean(),
              positiveCount: z.number(),
              totalCount: z.number()
            }),
            acessibilidadeVisual: z.object({
              percentage: z.number(),
              hasMajority: z.boolean(),
              positiveCount: z.number(),
              totalCount: z.number()
            })
          })
        }),
        404: z.object({
          message: z.string()
        }),
        500: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { placeId } = request.params as { placeId: string }

      // Verificar se o local existe
      const [place] = await db
        .select({
          id: places.id,
          name: places.name,
          address: places.address
        })
        .from(places)
        .where(eq(places.id, placeId))
        .limit(1)

      if (!place) {
        return reply.status(404).send({
          message: 'Local não encontrado'
        })
      }

      // Buscar todos os relatos do local
      const allReports = await db
        .select({
          rampaAcesso: reports.rampaAcesso,
          banheiroAcessivel: reports.banheiroAcessivel,
          estacionamentoAcessivel: reports.estacionamentoAcessivel,
          acessibilidadeVisual: reports.acessibilidadeVisual
        })
        .from(reports)
        .where(eq(reports.placeId, placeId))

      const totalReports = allReports.length

      if (totalReports === 0) {
        return reply.status(200).send({
          place: {
            id: place.id,
            name: place.name,
            address: place.address
          },
          totalReports: 0,
          accessibilityStats: {
            rampaAcesso: {
              percentage: 0,
              hasMajority: false,
              positiveCount: 0,
              totalCount: 0
            },
            banheiroAcessivel: {
              percentage: 0,
              hasMajority: false,
              positiveCount: 0,
              totalCount: 0
            },
            estacionamentoAcessivel: {
              percentage: 0,
              hasMajority: false,
              positiveCount: 0,
              totalCount: 0
            },
            acessibilidadeVisual: {
              percentage: 0,
              hasMajority: false,
              positiveCount: 0,
              totalCount: 0
            }
          }
        })
      }

      // Calcular estatísticas para cada campo
      const calculateFieldStats = (fieldName: keyof typeof allReports[0]) => {
        const positiveCount = allReports.filter(report => report[fieldName] === true).length
        const percentage = totalReports > 0 ? (positiveCount / totalReports) * 100 : 0
        const hasMajority = percentage > 50

        return {
          percentage: Math.round(percentage * 100) / 100, // Arredondar para 2 casas decimais
          hasMajority,
          positiveCount,
          totalCount: totalReports
        }
      }

      const accessibilityStats = {
        rampaAcesso: calculateFieldStats('rampaAcesso'),
        banheiroAcessivel: calculateFieldStats('banheiroAcessivel'),
        estacionamentoAcessivel: calculateFieldStats('estacionamentoAcessivel'),
        acessibilidadeVisual: calculateFieldStats('acessibilidadeVisual')
      }

      return reply.status(200).send({
        place: {
          id: place.id,
          name: place.name,
          address: place.address
        },
        totalReports,
        accessibilityStats
      })

    } catch (error) {
      console.error('Erro na rota get-place-accessibility-stats:', error)
      return reply.status(500).send({
        message: 'Erro interno do servidor'
      })
    }
  })
}
