import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { placesService } from '../../src/services/places'
import { googleMapsService } from '../../src/services/google-maps'

const checkOrCreateSchema = z.object({
  placeId: z.string().min(1),
})

export async function checkOrCreateRoute(app: FastifyInstance) {
  app.post('/places/check-or-create', {
    schema: {
      tags: ['Places'],
      summary: "Check or Create",
      description: "Verifica se um local existe no sistema pelo place_id do Google Maps. Se não existir, cria automaticamente.",
      body: checkOrCreateSchema,
      response: {
        200: z.object({
          exists: z.boolean(),
          place: z.object({
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
          message: z.string(),
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
      const { placeId } = request.body as { placeId: string }

      // Primeiro, verifica se o local já existe no banco
      const existingPlace = await placesService.findByPlaceId(placeId)
      
      if (existingPlace) {
        return reply.status(200).send({
          exists: true,
          place: existingPlace,
          message: 'Local já existe no sistema',
        })
      }

      // Se não existe, busca os detalhes no Google Maps
      const googlePlaceDetails = await googleMapsService.instance.getPlaceDetails(placeId)
      
      if (!googlePlaceDetails) {
        return reply.status(404).send({
          error: 'Local não encontrado no Google Maps',
        })
      }

      // Cria o local no banco de dados
      const newPlace = await placesService.findOrCreateFromGooglePlace(googlePlaceDetails)

      return reply.status(200).send({
        exists: false,
        place: newPlace,
        message: 'Local criado com sucesso no sistema',
      })
    } catch (error) {
      console.error('Erro na rota check-or-create:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
