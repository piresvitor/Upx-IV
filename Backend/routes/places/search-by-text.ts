import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { placesService } from '../../src/services/places'

const searchByTextSchema = z.object({
  query: z.string().min(1, 'Query não pode estar vazio'),
  latitude: z.string().transform(Number).refine(val => !isNaN(val), 'Latitude inválida').optional(),
  longitude: z.string().transform(Number).refine(val => !isNaN(val), 'Longitude inválida').optional(),
  radius: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, 'Raio inválido').optional(),
})

export async function searchByTextRoute(app: FastifyInstance) {
  app.get('/places/search-by-text', {
    schema: {
      tags: ['Places'],
      summary: 'Search Places by Text',
      description: 'Busca locais usando texto (nome ou endereço) através da API do Google Maps.',
      querystring: searchByTextSchema,
      response: {
        200: z.object({
          places: z.array(z.object({
            id: z.string(),
            placeId: z.string(),
            name: z.string(),
            address: z.string().nullable(),
            latitude: z.number(),
            longitude: z.number(),
            types: z.array(z.string()),
            rating: z.number().nullable(),
            userRatingsTotal: z.number().nullable(),
          })),
          googlePlaces: z.array(z.object({
            place_id: z.string(),
            name: z.string(),
            formatted_address: z.string().optional(),
            geometry: z.object({
              location: z.object({
                lat: z.number(),
                lng: z.number(),
              }),
            }),
            types: z.array(z.string()),
            rating: z.number().optional(),
            user_ratings_total: z.number().optional(),
          })),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    try {
      const { query, latitude, longitude, radius } = request.query as {
        query: string
        latitude?: number
        longitude?: number
        radius?: number
      }

      const result = await placesService.searchByText(
        query,
        latitude,
        longitude,
        radius
      )

      return reply.status(200).send(result)
    } catch (error) {
      console.error('Erro na rota search-by-text:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}

