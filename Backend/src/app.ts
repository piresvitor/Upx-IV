import fastifySwagger from '@fastify/swagger'
import fastify from 'fastify'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { loginRoute } from '../routes/auth/login'
import { logoutRoute } from '../routes/auth/logout'
import { getMeRoute, updateMeRoute, deleteMeRoute, getAllUsersRoute } from '../routes/users'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { pingRoute } from '../routes/ping'
import { registerRoute } from '../routes/auth/register'
import { searchNearbyRoute, checkOrCreateRoute, getPlaceRoute, updatePlaceRoute, getAllPlacesRoute } from '../routes/places'
import { reportsRoutes } from '../routes/reports'


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

server.register(scalarAPIReference, {
    routePrefix: '/docs',
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
server.register(reportsRoutes)

export { server }