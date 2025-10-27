import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { authenticateToken } from '../../src/middleware/auth.ts'
import { FastifyRequest } from 'fastify'
import { hash } from 'argon2'

const bodySchema = z.object({
  name: z.string().min(3).optional(),
  email: z.email().optional(),
  password: z.string().min(8).optional(),
})

export const updateMeRoute: FastifyPluginAsyncZod = async (server) => {
  server.put('/users/me', {
    preHandler: authenticateToken,
    schema: {
      tags: ['Users'],
      summary: 'Update User',
      description: 'Atualiza dados do perfil do usuário',
      headers: z.object({
        authorization: z.string().regex(/^Bearer .+/, 'Authorization header must be Bearer token')
      }),
      body: bodySchema,
      response: {
        200: z.object({
          message: z.string(),
          user: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.string(),
          })
        }),
        400: z.object({
          message: z.string()
        }),
        401: z.object({
          message: z.string()
        }),
        409: z.object({
          message: z.string()
        })
      }
    }
  }, async (request: FastifyRequest, reply) => {
    try {
      const userId = request.user.id
      const { name, email, password } = request.body as z.infer<typeof bodySchema>

      // Verificar se pelo menos um campo foi fornecido
      if (!name && !email && !password) {
        return reply.status(400).send({ 
          message: 'Pelo menos um campo deve ser fornecido para atualização' 
        })
      }

      // Verificar se o email já existe (se estiver sendo atualizado)
      if (email) {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        if (existingUser && existingUser.id !== userId) {
          return reply.status(409).send({ 
            message: 'Email já está sendo usado por outro usuário' 
          })
        }
      }

      // Preparar dados para atualização
      const updateData: any = {}
      if (name) updateData.name = name
      if (email) updateData.email = email
      if (password) updateData.passwordHash = await hash(password)

      // Atualizar usuário
      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role
        })

      if (!updatedUser) {
        return reply.status(404).send({ 
          message: 'Usuário não encontrado' 
        })
      }

      return reply.status(200).send({
        message: 'Perfil atualizado com sucesso',
        user: updatedUser
      })

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}
