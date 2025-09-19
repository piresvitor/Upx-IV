import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { placesService } from '../../src/services/places'

export async function getPlaceRoute(app: FastifyInstance) {
  app.get('/places/:placeId', {
    schema: {
      tags: ['Places'],
      summary: "Get Place",
      description: "Obtém detalhes de um local específico pelo ID.",
      params: z.object({
        placeId: z.string().uuid(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          placeId: z.string(),
          name: z.string(),
          address: z.string().nullable(),
          latitude: z.number(),
          longitude: z.number(),
          types: z.array(z.string()),
          rating: z.number().nullable(),
          userRatingsTotal: z.number().nullable(),
          createdAt: z.date(),
          updatedAt: z.date(),
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
      const { placeId } = request.params as { placeId: string }

      const place = await placesService.findById(placeId)
      
      if (!place) {
        return reply.status(404).send({
          error: 'Local não encontrado',
        })
      }

      return reply.status(200).send(place)
    } catch (error) {
      console.error('Erro na rota get-place:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
