import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { authenticateToken } from '../../src/middleware/auth.ts'
import { FastifyRequest } from 'fastify'

export const getMeRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/users/me', {
    preHandler: authenticateToken,
    schema: {
      tags: ['Users'],
      summary: 'Get User',
      description: 'Retorna dados do usuário autenticado',
      headers: z.object({
        authorization: z.string().regex(/^Bearer .+/, 'Authorization header must be Bearer token')
      }),
      response: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          role: z.string(),
        }),
        500: z.object({
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

      // Buscar dados do usuário no banco
      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      if (!user) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      return reply.status(200).send(user)

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}
