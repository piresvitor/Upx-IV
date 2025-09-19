import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      reply.status(401).send({ message: 'Token de autorização não fornecido' })
      return
    }

    const token = authHeader.replace('Bearer ', '')
    
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET must be set")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
    
    // Adicionar dados do usuário ao request (via augmentation)
    request.user = {
      id: decoded.sub || decoded.id,
      role: decoded.role
    }
  } catch (error) {
    reply.status(401).send({ message: 'Token inválido ou expirado' })
  }
}

export async function authenticateTokenWithError(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      reply.status(401).send({ error: 'Token de autorização não fornecido' })
      return
    }

    const token = authHeader.replace('Bearer ', '')
    
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET must be set")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
    
    // Adicionar dados do usuário ao request (via augmentation)
    request.user = {
      id: decoded.sub || decoded.id,
      role: decoded.role
    }
  } catch (error) {
    reply.status(401).send({ error: 'Token inválido ou expirado' })
  }
}
