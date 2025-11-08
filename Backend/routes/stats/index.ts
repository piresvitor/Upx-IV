import { FastifyInstance } from 'fastify'
import { generalStatsRoute } from './general-stats'
import { reportsTrendsRoute } from './reports-trends'
import { reportsByTypeRoute } from './reports-by-type'
import { accessibilityFeaturesRoute } from './accessibility-features'

export async function statsRoutes(app: FastifyInstance) {
  app.register(generalStatsRoute)
  app.register(reportsTrendsRoute)
  app.register(reportsByTypeRoute)
  app.register(accessibilityFeaturesRoute)
}
