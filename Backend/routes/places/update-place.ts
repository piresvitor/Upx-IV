import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { placesService } from '../../src/services/places'

const updatePlaceSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional(),
  types: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  userRatingsTotal: z.number().min(0).optional(),
})

export async function updatePlaceRoute(app: FastifyInstance) {
  app.put('/places/:placeId', {
    schema: {
      tags: ['Places'],
      summary: "Update Place",
      description: "Atualiza informações de um local específico.",
      params: z.object({
        placeId: z.string().uuid(),
      }),
      body: updatePlaceSchema,
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
        400: z.object({
          error: z.string(),
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
      const updateData = request.body as {
        name?: string
        address?: string
        types?: string[]
        rating?: number
        userRatingsTotal?: number
      }

      // Verifica se o local existe
      const existingPlace = await placesService.findById(placeId)
      if (!existingPlace) {
        return reply.status(404).send({
          error: 'Local não encontrado',
        })
      }

      // Atualiza o local
      const updatedPlace = await placesService.update(placeId, updateData)

      return reply.status(200).send(updatedPlace)
    } catch (error) {
      console.error('Erro na rota update-place:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
