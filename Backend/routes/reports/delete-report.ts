import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { reports, votes } from '../../src/database/schema.ts'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { authenticateToken } from '../../src/middleware/auth.ts'

export const deleteReportRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete('/reports/:reportId', {
    preHandler: authenticateToken,
    schema: {
      tags: ['Reports'],
      summary: 'Delete Report',
      description: 'Remove um relato específico',
      params: z.object({ reportId: z.string().uuid() }),
      response: {
        200: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
        500: z.object({ message: z.string() })
      }
    }
  }, async (request, reply) => {
    try {
      const { reportId } = request.params as { reportId: string }
      const userId = request.user.id

      const existing = await db.select().from(reports).where(eq(reports.id, reportId)).limit(1)
      const report = existing[0]
      if (!report) return reply.status(404).send({ message: 'Relato não encontrado' })
      if (report.userId !== userId) return reply.status(403).send({ message: 'Acesso negado' })

      // Deletar votos associados primeiro (devido à foreign key constraint)
      await db.delete(votes).where(eq(votes.reportId, reportId))
      
      // Depois deletar o relatório
      await db.delete(reports).where(eq(reports.id, reportId))
      
      return reply.status(200).send({ message: 'Relato removido com sucesso' })
    } catch (error) {
      console.error('Erro ao remover relato:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}


