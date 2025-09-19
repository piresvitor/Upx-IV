import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { placesService } from '../../src/services/places'

const searchNearbySchema = z.object({
  latitude: z.string().transform(Number).refine(val => val >= -90 && val <= 90, "Latitude deve estar entre -90 e 90"),
  longitude: z.string().transform(Number).refine(val => val >= -180 && val <= 180, "Longitude deve estar entre -180 e 180"),
  radius: z.string().transform(Number).refine(val => val >= 1 && val <= 50000, "Raio deve estar entre 1 e 50000").optional().default(1000),
  type: z.string().optional(),
  keyword: z.string().optional(),
})

export async function searchNearbyRoute(app: FastifyInstance) {
  app.get('/places/search-nearby', {

    schema: {
      tags: ['Places'],
      summary: "Search Nearby",
      description: "Busca locais próximos a uma localização específica usando a API do Google Maps.",
      querystring: searchNearbySchema,
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
            createdAt: z.date(),
            updatedAt: z.date(),
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
        400: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    try {
      const { latitude, longitude, radius, type, keyword } = request.query as { latitude: number; longitude: number; radius: number; type?: string; keyword?: string }

      const result = await placesService.searchNearbyPlaces(
        latitude,
        longitude,
        radius,
        type,
        keyword
      )

      return reply.status(200).send(result)
    } catch (error) {
      console.error('Erro na rota search-nearby:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
