import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { reports } from '../../src/database/schema.ts'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { authenticateToken } from '../../src/middleware/auth.ts'

// Tipos válidos de relatórios
const VALID_REPORT_TYPES = ['positive', 'negative', 'neutral', 'accessibility', 'report'] as const

const bodySchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  type: z.enum(VALID_REPORT_TYPES, {
    errorMap: () => ({ 
      message: `Tipo deve ser um dos seguintes: ${VALID_REPORT_TYPES.join(', ')}` 
    })
  }).optional(),
  rampaAcesso: z.boolean().optional(),
  banheiroAcessivel: z.boolean().optional(),
  estacionamentoAcessivel: z.boolean().optional(),
  acessibilidadeVisual: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'Nenhum campo para atualizar' })

export const updateReportRoute: FastifyPluginAsyncZod = async (server) => {
  server.put('/reports/:reportId', {
    preHandler: authenticateToken,
    schema: {
      tags: ['Reports'],
      summary: 'Update Report',
      description: 'Atualiza um relato específico',
      params: z.object({ reportId: z.string().uuid() }),
      body: bodySchema,
      response: {
        200: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      }
    }
  }, async (request, reply) => {
    try {
      const { reportId } = request.params as { reportId: string }
      const { 
        title, 
        description, 
        type, 
        rampaAcesso, 
        banheiroAcessivel, 
        estacionamentoAcessivel, 
        acessibilidadeVisual 
      } = request.body as z.infer<typeof bodySchema>
      const userId = request.user.id

      const existing = await db.select().from(reports).where(eq(reports.id, reportId)).limit(1)
      const report = existing[0]
      if (!report) return reply.status(404).send({ message: 'Relato não encontrado' })
      if (report.userId !== userId) return reply.status(403).send({ message: 'Acesso negado' })

      // Construir objeto de atualização apenas com campos fornecidos
      // Para campos booleanos, precisamos verificar explicitamente se foram fornecidos (não undefined)
      const updateData: any = {}
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (type !== undefined) updateData.type = type
      if (rampaAcesso !== undefined) updateData.rampaAcesso = rampaAcesso
      if (banheiroAcessivel !== undefined) updateData.banheiroAcessivel = banheiroAcessivel
      if (estacionamentoAcessivel !== undefined) updateData.estacionamentoAcessivel = estacionamentoAcessivel
      if (acessibilidadeVisual !== undefined) updateData.acessibilidadeVisual = acessibilidadeVisual

      await db.update(reports).set(updateData).where(eq(reports.id, reportId))

      return reply.status(200).send({ message: 'Relato atualizado com sucesso' })
    } catch (error) {
      console.error('Erro ao atualizar relato:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}


