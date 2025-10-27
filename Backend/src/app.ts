import dotenv from 'dotenv'
import fastifySwagger from '@fastify/swagger'
import fastify from 'fastify'
import swaggerUI from '@fastify/swagger-ui'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

dotenv.config()
import { loginRoute } from '../routes/auth/login'
import { logoutRoute } from '../routes/auth/logout'
import { getMeRoute, updateMeRoute, deleteMeRoute, getAllUsersRoute } from '../routes/users'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { pingRoute } from '../routes/ping'
import { registerRoute } from '../routes/auth/register'
import { searchNearbyRoute, checkOrCreateRoute, getPlaceRoute, updatePlaceRoute, getAllPlacesRoute, getPlaceReportsRoute, getPlaceAccessibilityStats } from '../routes/places'
import { reportsRoutes } from '../routes/reports'
import { statsRoutes } from '../routes/stats'
// import cors from '@fastify/cors' // Removido temporariamente


const server = fastify({
    logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
    }
})

// Configurar CORS manualmente
server.addHook('onRequest', async (request, reply) => {
    // Obter a origem da requisição
    const origin = request.headers.origin || request.headers.host
    
    // Headers CORS para todas as requisições
    reply.header('Access-Control-Allow-Origin', origin || '*')
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers')
    reply.header('Access-Control-Allow-Credentials', 'true')
    reply.header('Access-Control-Expose-Headers', 'Content-Length, X-Foo, X-Bar')
    
    // Lidar com requisições OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
        reply.code(204)
        return reply.send()
    }
})

if (process.env.NODE_ENV === "development"){
    server.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Mapa Colaborativo de Acessibilidade",
            version: '1.0.0'
        }
    },

    transform: jsonSchemaTransform,
})

// Scalar UI em /docs
server.register(scalarAPIReference, {
    routePrefix: '/docs',
})

// Swagger UI em /reference
server.register(swaggerUI, {
    routePrefix: '/reference',
})
}

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(pingRoute)
server.register(loginRoute)
server.register(logoutRoute)
server.register(registerRoute)
server.register(getMeRoute)
server.register(updateMeRoute)
server.register(deleteMeRoute)
server.register(getAllUsersRoute)
server.register(searchNearbyRoute)
server.register(checkOrCreateRoute)
server.register(getPlaceRoute)
server.register(updatePlaceRoute)
server.register(getAllPlacesRoute)
server.register(getPlaceReportsRoute)
server.register(getPlaceAccessibilityStats)
server.register(reportsRoutes)
server.register(statsRoutes)

export { server }