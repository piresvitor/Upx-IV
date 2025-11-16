import dotenv from 'dotenv'
import fastifySwagger from '@fastify/swagger'
import fastify from 'fastify'
import swaggerUI from '@fastify/swagger-ui'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

dotenv.config()
import { loginRoute } from '../routes/auth/login'
import { logoutRoute } from '../routes/auth/logout'
import { getMeRoute, updateMeRoute, deleteMeRoute, getAllUsersRoute, getMyStatsRoute } from '../routes/users'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { pingRoute } from '../routes/ping'
import { registerRoute } from '../routes/auth/register'
import { searchNearbyRoute, checkOrCreateRoute, getPlaceRoute, updatePlaceRoute, getAllPlacesRoute, getPlaceReportsRoute, getPlaceAccessibilityStats, getPlacesWithReportsRoute } from '../routes/places'
import { reportsRoutes } from '../routes/reports'
import { statsRoutes } from '../routes/stats'
import { toggleFavoriteRoute, getFavoritesRoute, checkFavoriteRoute } from '../routes/favorites'
// import cors from '@fastify/cors' // Removido temporariamente


const server = fastify({
    logger: process.env.NODE_ENV === 'development' ? {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    } : true
})

// Configurar CORS manualmente
server.addHook('onRequest', async (request, reply) => {
    // Lista de origens permitidas
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5174',
        'https://mapa-acessibilidade-frontend.onrender.com',
        'https://www.mapa-acessibilidade-frontend.onrender.com'
    ]
    
    // Obter a origem da requisição
    const origin = request.headers.origin
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isPreflight = request.method === 'OPTIONS'
    
    // Verificar se a origem é permitida
    const isAllowedOrigin = origin && (allowedOrigins.includes(origin) || isDevelopment)
    
    // Para requisições OPTIONS (preflight), sempre adicionar headers CORS
    // Para outras requisições, apenas se a origem for permitida
    if (isPreflight || isAllowedOrigin) {
        // Definir origem permitida
        if (isAllowedOrigin && origin) {
            reply.header('Access-Control-Allow-Origin', origin)
            reply.header('Vary', 'Origin')
        } else if (isDevelopment && !origin) {
            reply.header('Access-Control-Allow-Origin', '*')
        }
        
        // Headers CORS sempre adicionados para preflight ou requisições permitidas
        reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
        reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers')
        reply.header('Access-Control-Allow-Credentials', 'true')
        reply.header('Access-Control-Max-Age', '86400') // 24 horas
        reply.header('Access-Control-Expose-Headers', 'Content-Length, X-Foo, X-Bar')
    }
    
    // Lidar com requisições OPTIONS (preflight) - sempre responder
    if (isPreflight) {
        reply.code(204)
        return reply.send()
    }
})

if (process.env.NODE_ENV === "development"){
    server.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Mobiaccess: Mapa Colaborativo de Acessibilidade",
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
server.register(getMyStatsRoute)
server.register(searchNearbyRoute)
server.register(checkOrCreateRoute)
server.register(getPlaceRoute)
server.register(updatePlaceRoute)
server.register(getAllPlacesRoute)
server.register(getPlaceReportsRoute)
server.register(getPlaceAccessibilityStats)
server.register(getPlacesWithReportsRoute)
server.register(toggleFavoriteRoute)
server.register(getFavoritesRoute)
server.register(checkFavoriteRoute)
server.register(reportsRoutes)
server.register(statsRoutes)

export { server }