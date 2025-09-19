import { FastifyInstance } from 'fastify'
import { createReportRoute } from './create-report'
import { getReportRoute } from './get-report'
import { updateReportRoute } from './update-report'
import { deleteReportRoute } from './delete-report'
import { listReportsRoute } from './list-reports'
import { createVoteRoute } from './create-vote'
import { deleteVoteRoute } from './delete-vote'

export async function reportsRoutes(app: FastifyInstance) {
  app.register(createReportRoute)
  app.register(getReportRoute)
  app.register(updateReportRoute)
  app.register(deleteReportRoute)
  app.register(listReportsRoute)
  app.register(createVoteRoute)
  app.register(deleteVoteRoute)
  // GET /places/:placeId/reports está em routes/places/get-place-reports.ts
}
