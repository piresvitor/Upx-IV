import { FastifyInstance } from 'fastify'
import { createReportRoute } from './create-report'

export async function reportsRoutes(app: FastifyInstance) {
  app.register(createReportRoute)
  // GET /places/:placeId/reports agora é registrado em routes/places/get-place-reports.ts
}
