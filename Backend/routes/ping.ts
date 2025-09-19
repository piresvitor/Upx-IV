import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../src/database/cliente.ts'  
import { users } from '../src/database/schema.ts'
import z from 'zod'

export const pingRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/ping', {
    schema: {
      tags: ['Diagnostics'],
      summary: "Health check (server + DB)",
      response: {
        200: z.object({
        status: z.string(),
        server: z.string(),
        db: z.string(),
  }),
  500: z.object({
    status: z.string(),
    message: z.string(),
    details: z.string(),
  })
}}
  }, async (request, reply) => {
    try {
      const result = await db.select().from(users).limit(1)

      return {
        status: 'ok',
        server: 'Hello, World!',
        db: result.length > 0 
          ? `DB conectado (primeiro usuário: ${result[0].email})`
          : 'DB conectado, mas sem usuários',
      }
    } catch (err: any) {
      return reply.status(500).send({
        status: 'error',
        message: 'Falha ao conectar no banco',
        details: err.message,
      })
    }
  })
}