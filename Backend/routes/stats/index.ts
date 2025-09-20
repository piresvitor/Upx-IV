import { FastifyInstance } from 'fastify'
import { generalStatsRoute } from './general-stats'
import { reportsTrendsRoute } from './reports-trends'
import { reportsByTypeRoute } from './reports-by-type'

export async function statsRoutes(app: FastifyInstance) {
  app.register(generalStatsRoute)
  app.register(reportsTrendsRoute)
  app.register(reportsByTypeRoute)
}
