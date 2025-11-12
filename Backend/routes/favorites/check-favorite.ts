import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../../src/database/cliente'
import { favorites } from '../../src/database/schema'
import { eq, and } from 'drizzle-orm'
import { authenticateTokenWithError } from '../../src/middleware/auth'

export async function checkFavoriteRoute(app: FastifyInstance) {
  app.get('/places/:placeId/favorites/check', {
    preHandler: [authenticateTokenWithError],
    schema: {
      tags: ['Favorites'],
      summary: "Check if Place is Favorite",
      description: "Verifica se um local está nos favoritos do usuário.",
      params: z.object({
        placeId: z.string().uuid('ID do local deve ser um UUID válido'),
      }),
      response: {
        200: z.object({
          isFavorite: z.boolean(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const { placeId } = request.params as { placeId: string }

      const [favorite] = await db
        .select()
        .from(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.placeId, placeId)
        ))
        .limit(1)

      return reply.status(200).send({
        isFavorite: !!favorite,
      })
    } catch (error) {
      console.error('Erro na rota check-favorite:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}

