import dotenv from 'dotenv'
import {server} from './app.ts'

dotenv.config()

console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DATABASE_URL:', process.env.DATABASE_URL)

server.listen({port: 3333}).then(() =>{
    console.log('HTTP server running!')
})