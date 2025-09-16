import 'fastify'

export interface AuthenticatedUser {
  id: string
  role: string
}

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthenticatedUser
  }
}


