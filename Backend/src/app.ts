import fastify from 'fastify'

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

const users = [
    {id: '1', name: "Vitor", email: "vitorteste@gmail.com"},
    {id: '2', name: "Gabriel", email: "gabrielteste@gmail.com"},
    {id: '3', name: "Gabriel", email: "gabrielteste@gmail.com"},

]

server.get('/user', (request, replay) => {
    return replay.status(200).send({users})
})

server.get('/user/:id', (request, reply)=>{
    type Params = {
        id: string
    }

    const params = request.params as Params
    const userID = params.id

    const user = users.find(user => user.id === userID)
    if (user){
        return {user}
    }
    return reply.status(404).send({ error: 'Usuário não encontrado' })
})

export { server }