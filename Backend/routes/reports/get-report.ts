import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { reports, users, places } from '../../src/database/schema.ts'
import { eq } from 'drizzle-orm'
import z from 'zod'

export const getReportRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/reports/:reportId', {
    schema: {
      tags: ['Reports'],
      summary: 'Get Report',
      description: 'Obtém um relato específico',
      params: z.object({
        reportId: z.string().uuid(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          type: z.string(),
          createdAt: z.date(),
          user: z.object({ id: z.string(), name: z.string(), email: z.string() }),
          place: z.object({ id: z.string(), name: z.string() }).nullable(),
          rampaAcesso: z.boolean(),
          banheiroAcessivel: z.boolean(),
          estacionamentoAcessivel: z.boolean(),
          acessibilidadeVisual: z.boolean(),
        }),
        404: z.object({ message: z.string() }),
        500: z.object({ message: z.string() })
      }
    }
  }, async (request, reply) => {
    try {
      const { reportId } = request.params as { reportId: string }

      const result = await db
        .select({
          id: reports.id,
          title: reports.title,
          description: reports.description,
          type: reports.type,
          createdAt: reports.createdAt,
          userId: users.id,
          userName: users.name,
          userEmail: users.email,
          placeId: places.id,
          placeName: places.name,
          rampaAcesso: reports.rampaAcesso,
          banheiroAcessivel: reports.banheiroAcessivel,
          estacionamentoAcessivel: reports.estacionamentoAcessivel,
          acessibilidadeVisual: reports.acessibilidadeVisual,
        })
        .from(reports)
        .innerJoin(users, eq(reports.userId, users.id))
        .leftJoin(places, eq(reports.placeId, places.id))
        .where(eq(reports.id, reportId))
        .limit(1)

      const row = result[0]
      if (!row) {
        return reply.status(404).send({ message: 'Relato não encontrado' })
      }

      return reply.status(200).send({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        createdAt: row.createdAt,
        user: { id: row.userId, name: row.userName, email: row.userEmail },
        place: row.placeId ? { id: row.placeId, name: row.placeName! } : null,
        rampaAcesso: row.rampaAcesso,
        banheiroAcessivel: row.banheiroAcessivel,
        estacionamentoAcessivel: row.estacionamentoAcessivel,
        acessibilidadeVisual: row.acessibilidadeVisual,
      })
    } catch (error) {
      console.error('Erro ao buscar relato:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}


