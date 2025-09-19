import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../../src/database/cliente'
import { places } from '../../src/database/schema'
import { desc, asc, like, ilike, and, or, count, arrayContains } from 'drizzle-orm'

export async function getAllPlacesRoute(app: FastifyInstance) {
  app.get('/places', {
    schema: {
      tags: ['Places'],
      summary: "Get All Places",
      description: "Busca todos os locais com filtros e paginação.",
      querystring: z.object({
        page: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, "Página deve ser um número válido maior que 0").optional().default(1),
        limit: z.string().transform(Number).refine(val => !isNaN(val) && val > 0, "Limite deve ser um número válido maior que 0").optional().default(10),
        search: z.string().optional(),
        type: z.string().optional(),
        sortBy: z.enum(['name', 'rating', 'createdAt']).optional().default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
      }),
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
          pagination: z.object({
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
          }),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    try {
      const { page, limit, search, type, sortBy, sortOrder } = request.query as {
        page: number
        limit: number
        search?: string
        type?: string
        sortBy: 'name' | 'rating' | 'createdAt'
        sortOrder: 'asc' | 'desc'
      }

      const offset = (page - 1) * limit

      // Construir condições de filtro
      const conditions = []
      
      if (search) {
        conditions.push(
          or(
            ilike(places.name, `%${search}%`),
            ilike(places.address, `%${search}%`)
          )
        )
      }

      if (type) {
        conditions.push(arrayContains(places.types, [type]))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Construir ordenação
      let orderBy
      switch (sortBy) {
        case 'name':
          orderBy = sortOrder === 'asc' ? asc(places.name) : desc(places.name)
          break
        case 'rating':
          orderBy = sortOrder === 'asc' ? asc(places.rating) : desc(places.rating)
          break
        case 'createdAt':
        default:
          orderBy = sortOrder === 'asc' ? asc(places.createdAt) : desc(places.createdAt)
          break
      }

      // Buscar locais
      const placesData = await db
        .select()
        .from(places)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)

      // Contar total
      const [{ total }] = await db
        .select({ total: count() })
        .from(places)
        .where(whereClause)

      const totalPages = Math.ceil(total / limit)

      return reply.status(200).send({
        places: placesData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      })
    } catch (error) {
      console.error('Erro na rota get-all-places:', error)
      
      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }
      
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
