import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../../src/database/cliente'
import { reports } from '../../src/database/schema'
import { placesService } from '../../src/services/places'
import { authenticateTokenWithError } from '../../src/middleware/auth'

const createReportSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  type: z.string().min(1),
})

export async function createReportRoute(app: FastifyInstance) {
  app.post('/places/:placeId/reports', {
    onRequest: [authenticateTokenWithError],
    schema: {
      params: z.object({
        placeId: z.string().uuid(),
      }),
      tags: ['Places'],
      summary: "Create Report",
      description: "Cria um novo relato para um local específico.",
      body: createReportSchema,
        response: {
          201: z.object({
            report: z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
              type: z.string(),
              createdAt: z.date(),
              userId: z.string(),
              placeId: z.string(),
            }),
            message: z.string(),
          }),
        400: z.object({
          error: z.string(),
        }),
        401: z.object({
          error: z.string(),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    try {
      const { placeId } = request.params as { placeId: string }
      const { title, description, type } = request.body as { title: string; description: string; type: string }
      const userId = request.user.id

      // Verifica se o local existe
      const place = await placesService.findById(placeId)
      if (!place) {
        return reply.status(404).send({
          error: 'Local não encontrado',
        })
      }

      // Cria o relato
      const [newReport] = await db
        .insert(reports)
        .values({
          title,
          description,
          type,
          userId,
          placeId,
        })
        .returning()

      return reply.status(201).send({
        report: newReport,
        message: 'Relato criado com sucesso',
      })
    } catch (error) {
      console.error('Erro na rota create-report:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
