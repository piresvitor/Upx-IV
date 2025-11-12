import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../../src/database/cliente'
import { favorites, places } from '../../src/database/schema'
import { eq, and } from 'drizzle-orm'
import { authenticateTokenWithError } from '../../src/middleware/auth'

export async function toggleFavoriteRoute(app: FastifyInstance) {
  app.post('/places/:placeId/favorites', {
    preHandler: [authenticateTokenWithError],
    schema: {
      tags: ['Favorites'],
      summary: "Toggle Favorite Place",
      description: "Adiciona ou remove um local dos favoritos do usuário.",
      params: z.object({
        placeId: z.string().uuid('ID do local deve ser um UUID válido'),
      }),
      response: {
        200: z.object({
          isFavorite: z.boolean(),
          message: z.string(),
        }),
        404: z.object({
          error: z.string(),
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

      // Verificar se o local existe
      const [place] = await db
        .select()
        .from(places)
        .where(eq(places.id, placeId))
        .limit(1)

      if (!place) {
        return reply.status(404).send({
          error: 'Local não encontrado',
        })
      }

      // Verificar se já está favoritado
      const [existingFavorite] = await db
        .select()
        .from(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.placeId, placeId)
        ))
        .limit(1)

      if (existingFavorite) {
        // Remover dos favoritos
        await db
          .delete(favorites)
          .where(and(
            eq(favorites.userId, userId),
            eq(favorites.placeId, placeId)
          ))

        return reply.status(200).send({
          isFavorite: false,
          message: 'Local removido dos favoritos',
        })
      } else {
        // Adicionar aos favoritos
        await db.insert(favorites).values({
          userId,
          placeId,
        })

        return reply.status(200).send({
          isFavorite: true,
          message: 'Local adicionado aos favoritos',
        })
      }
    } catch (error) {
      console.error('Erro na rota toggle-favorite:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}

