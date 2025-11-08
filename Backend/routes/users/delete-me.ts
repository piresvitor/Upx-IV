import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { users, reports, votes } from '../../src/database/schema.ts'
import { eq, inArray } from 'drizzle-orm'
import z from 'zod'
import { authenticateToken } from '../../src/middleware/auth.ts'
import { FastifyRequest } from 'fastify'
import { verify } from 'argon2'

export const deleteMeRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete('/users/me', {
    preHandler: authenticateToken,
    schema: {
      tags: ['Users'],
      summary: 'Delete User',
      description: 'Exclui a conta do usuário autenticado',
      headers: z.object({
        authorization: z.string().regex(/^Bearer .+/, 'Authorization header must be Bearer token')
      }),
      // Removido body do schema para evitar problemas com DELETE
      // O body será processado manualmente
      response: {
        200: z.object({
          message: z.string()
        }),
        400: z.object({
          message: z.string()
        }),
        401: z.object({
          message: z.string()
        }),
        403: z.object({
          message: z.string()
        }),
        404: z.object({
          message: z.string()
        })
      }
    }
  }, async (request: FastifyRequest, reply) => {
    try {
      // Verificar se o usuário está autenticado
      if (!request.user || !request.user.id) {
        return reply.status(401).send({ message: 'Não autenticado' })
      }
      
      const userId = request.user.id
      
      // Log para debug
      console.log('DELETE /users/me - User ID:', userId)
      console.log('DELETE /users/me - Body recebido:', request.body)
      console.log('DELETE /users/me - Body type:', typeof request.body)
      console.log('DELETE /users/me - Headers:', request.headers['content-type'])
      console.log('DELETE /users/me - Raw body:', request.rawBody)
      
      // Obter a senha do body
      let password: string | undefined
      
      try {
        // Tentar obter do body processado
        if (request.body && typeof request.body === 'object' && 'password' in request.body) {
          password = (request.body as { password: string }).password
        } else if (request.body && typeof request.body === 'string') {
          // Se o body for uma string, tentar fazer parse
          try {
            const parsed = JSON.parse(request.body)
            password = parsed.password
          } catch (parseError) {
            console.error('Erro ao fazer parse do body:', parseError)
            return reply.status(400).send({ message: 'Formato de senha inválido' })
          }
        } else if (request.rawBody) {
          // Tentar processar o rawBody se disponível
          try {
            const parsed = JSON.parse(request.rawBody.toString())
            password = parsed.password
          } catch (parseError) {
            console.error('Erro ao fazer parse do rawBody:', parseError)
          }
        }
      } catch (bodyError) {
        console.error('Erro ao processar body:', bodyError)
      }
      
      if (!password || password.trim() === '') {
        return reply.status(400).send({ message: 'Senha é obrigatória para excluir a conta' })
      }

      // Verificar se o usuário existe
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      if (!existingUser) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      // Verificar se a senha está correta
      const isPasswordValid = await verify(existingUser.passwordHash, password)
      if (!isPasswordValid) {
        return reply.status(403).send({ message: 'Senha incorreta' })
      }

      // Excluir registros relacionados primeiro (devido às foreign keys)
      // 1. Buscar todos os reports do usuário para excluir os votes relacionados
      const userReports = await db
        .select({ id: reports.id })
        .from(reports)
        .where(eq(reports.userId, userId))

      const reportIds = userReports.map(r => r.id)

      // 2. Excluir todos os votes dos reports do usuário (se houver)
      if (reportIds.length > 0) {
        await db
          .delete(votes)
          .where(inArray(votes.reportId, reportIds))
      }

      // 3. Excluir todos os votes do usuário (votos que ele deu)
      await db
        .delete(votes)
        .where(eq(votes.userId, userId))

      // 4. Excluir todos os reports do usuário
      await db
        .delete(reports)
        .where(eq(reports.userId, userId))

      // 5. Por fim, excluir o usuário
      await db
        .delete(users)
        .where(eq(users.id, userId))

      return reply.status(200).send({ 
        message: 'Conta excluída com sucesso' 
      })

    } catch (error) {
      console.error('Erro ao excluir conta:', error)
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A')
      return reply.status(500).send({ 
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  })
}
