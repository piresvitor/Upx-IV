import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import jwt from 'jsonwebtoken'

export const logoutRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/auth/logout', {
    schema: {
      tags: ['Auth'],
      summary: 'Logout',
      description: "Realiza logout do usuário (requer autenticação).",
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
        500: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      // Extrair o token do header Authorization
      const authHeader = request.headers.authorization
      if (!authHeader) {
        return reply.status(401).send({ message: 'Token de autorização não fornecido' })
      }

      const token = authHeader.replace('Bearer ', '')
      
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be set")
      }

      // Verificar se o token é válido (opcional - apenas para confirmar que o usuário estava logado)
      try {
        jwt.verify(token, process.env.JWT_SECRET)
      } catch (error) {
        return reply.status(401).send({ message: 'Token inválido ou expirado' })
      }

      // O cliente deve descartar o token localmente
      return reply.status(200).send({ 
        message: 'Logout realizado com sucesso. Descarte o token localmente.' 
      })

    } catch (error) {
      console.error('Erro no logout:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })
}
