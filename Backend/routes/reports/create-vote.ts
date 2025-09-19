import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente'
import { votes, reports } from '../../src/database/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { authenticateToken } from '../../src/middleware/auth'

export const createVoteRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/reports/:reportId/votes', {
    preHandler: authenticateToken,
    schema: {
      tags: ['Reports'],
      summary: 'Create Vote',
      description: 'Cria um voto para um relato específico',
      params: z.object({ 
        reportId: z.string().uuid() 
      }),
      response: {
        201: z.object({ 
          message: z.string(),
          vote: z.object({
            id: z.number(),
            userId: z.string(),
            reportId: z.string(),
            createdAt: z.date()
          })
        }),
        400: z.object({ 
          message: z.string() 
        }),
        401: z.object({ 
          message: z.string() 
        }),
        404: z.object({ 
          message: z.string() 
        }),
        409: z.object({ 
          message: z.string() 
        }),
        500: z.object({ 
          message: z.string() 
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { reportId } = request.params as { reportId: string }
      const userId = request.user.id

      // Verifica se o relato existe
      const existingReport = await db
        .select()
        .from(reports)
        .where(eq(reports.id, reportId))
        .limit(1)
      
      if (existingReport.length === 0) {
        return reply.status(404).send({ 
          message: 'Relato não encontrado' 
        })
      }

      // Verifica se o usuário já votou neste relato
      const existingVote = await db
        .select()
        .from(votes)
        .where(and(
          eq(votes.userId, userId),
          eq(votes.reportId, reportId)
        ))
        .limit(1)

      if (existingVote.length > 0) {
        return reply.status(409).send({ 
          message: 'Você já votou neste relato' 
        })
      }

      // Cria o voto
      const [newVote] = await db
        .insert(votes)
        .values({
          userId,
          reportId
        })
        .returning()

      return reply.status(201).send({
        message: 'Voto criado com sucesso',
        vote: newVote
      })
    } catch (error) {
      console.error('Erro ao criar voto:', error)
      return reply.status(500).send({ 
        message: 'Erro interno do servidor' 
      })
    }
  })
}
