import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { authenticateToken } from '../../src/middleware/auth.ts'
import { FastifyRequest } from 'fastify'

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
      response: {
        200: z.object({
          message: z.string()
        }),
        401: z.object({
          message: z.string()
        }),
        404: z.object({
          message: z.string()
        })
      }
    }
  }, async (request: FastifyRequest, reply) => {
    try {
      const userId = request.user.id

      // Verificar se o usuário existe
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      if (!existingUser) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      // Excluir usuário
      await db
        .delete(users)
        .where(eq(users.id, userId))

      return reply.status(200).send({ 
        message: 'Conta excluída com sucesso' 
      })

    } catch (error) {
      console.error('Erro ao excluir conta:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}
