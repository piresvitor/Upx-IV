import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { reports, users, places, votes } from '../../src/database/schema.ts'
import { eq, count, and } from 'drizzle-orm'
import z from 'zod'
import jwt from 'jsonwebtoken'

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
          votesCount: z.number(),
          userVoted: z.boolean().optional(),
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

      // Buscar contagem de votos separadamente
      const votesResult = await db
        .select({ count: count() })
        .from(votes)
        .where(eq(votes.reportId, reportId))

      const row = result[0]
      if (!row) {
        return reply.status(404).send({ message: 'Relato não encontrado' })
      }

      const votesCount = votesResult[0]?.count || 0

      // Verificar se o usuário está autenticado e se votou no relato
      let userVoted = false
      let userId: string | undefined = undefined
      
      try {
        // Verificar token manualmente sem enviar resposta de erro
        const authHeader = request.headers.authorization
        if (authHeader) {
          const token = authHeader.replace('Bearer ', '')
          
          if (process.env.JWT_SECRET) {
            try {
              const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
              userId = decoded.sub || decoded.id
            } catch (error) {
              // Token inválido, mas não falha a requisição
              userId = undefined
            }
          }
        }
      } catch (error) {
        // Se houver erro, apenas ignora (usuário não autenticado)
        userId = undefined
      }

      // Se o usuário estiver autenticado, verificar se votou
      if (userId) {
        const userVoteResult = await db
          .select()
          .from(votes)
          .where(and(
            eq(votes.userId, userId),
            eq(votes.reportId, reportId)
          ))
          .limit(1)
        
        userVoted = userVoteResult.length > 0
      }

      const response: any = {
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
        votesCount: votesCount,
      }

      // Só adiciona userVoted se o usuário estiver autenticado
      if (userId) {
        response.userVoted = userVoted
      }

      return reply.status(200).send(response)
    } catch (error) {
      console.error('Erro ao buscar relato:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}


