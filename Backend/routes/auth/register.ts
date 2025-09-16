import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../src/database/cliente.ts'
import { users } from '../../src/database/schema.ts'
import { hash } from 'argon2'
import z from 'zod'
import { eq } from "drizzle-orm"


export const registerRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/auth/register', {
    schema: {
      tags: ['Auth'],
      summary: 'Cadastro de novo usuário',
      body: z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(8),
      }),
      response: {
        201: z.object({
          message: z.string(),
        }),
        409: z.object({
          message: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { name, email, password } = request.body

    // Verificação de usuário existente
    const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    if (existingUser) {
      return reply.status(409).send({ message: 'Usuário ja cadastrado com esse email' })
    }

    // Criação do hash da senha
    const passwordHash = await hash(password)

    await db.insert(users).values({
      name,
      email,
      passwordHash,
      // A role e o createdAt são definidos automaticamente pelo schema
    })

    return reply.status(201).send({ message: 'Usuário cadastrado com sucesso' })
  })
}