import fastifySwagger from '@fastify/swagger'
import fastify from 'fastify'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { loginRoute } from '../routes/login'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { pingRoute } from '../routes/ping'
import { registerRoute } from '../routes/register'


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
server.register(registerRoute)

export { server }