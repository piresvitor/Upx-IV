import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente'
import { votes, reports } from '../../src/database/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { authenticateToken } from '../../src/middleware/auth'

export const deleteVoteRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete('/reports/:reportId/votes', {
    preHandler: authenticateToken,
    schema: {
      tags: ['Reports'],
      summary: 'Delete Vote',
      description: 'Remove um voto de um relato específico',
      params: z.object({ 
        reportId: z.string().uuid() 
      }),
      response: {
        200: z.object({ 
          message: z.string()
        }),
        401: z.object({ 
          message: z.string() 
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

      // Verifica se o usuário tem um voto neste relato
      const existingVote = await db
        .select()
        .from(votes)
        .where(and(
          eq(votes.userId, userId),
          eq(votes.reportId, reportId)
        ))
        .limit(1)

      if (existingVote.length === 0) {
        return reply.status(404).send({ 
          message: 'Voto não encontrado' 
        })
      }

      // Remove o voto
      await db
        .delete(votes)
        .where(and(
          eq(votes.userId, userId),
          eq(votes.reportId, reportId)
        ))

      return reply.status(200).send({
        message: 'Voto removido com sucesso'
      })
    } catch (error) {
      console.error('Erro ao remover voto:', error)
      return reply.status(500).send({ 
        message: 'Erro interno do servidor' 
      })
    }
  })
}
