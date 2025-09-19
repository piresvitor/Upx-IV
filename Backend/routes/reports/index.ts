import { FastifyInstance } from 'fastify'
import { createReportRoute } from './create-report'
import { getReportsRoute } from './get-reports'

export async function reportsRoutes(app: FastifyInstance) {
  app.register(createReportRoute)
  app.register(getReportsRoute)
}
