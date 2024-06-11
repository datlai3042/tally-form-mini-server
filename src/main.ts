import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'

import { config } from 'dotenv'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import bodyParser from 'body-parser'
import router from './routers'
import { ErrorServer } from './type'
import MongoConnect from './db/mongo.connect'
import errorHandler from './helpers/errorHandler'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import SocketService from './services/Socket.service'

config()
const app = express()
const server = createServer(app)
const io = new Server(server, {
      cors: {
            origin: process.env.MODE === 'DEV' ? 'http://localhost:3000' : process.env.CLIENT_URL, // Cho phép truy cập từ origin này
            methods: ['GET', 'POST'], // Chỉ cho phép các phương thức GET và POST
            allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Chỉ
            credentials: true
      },
      cookie: true
})

global._io = io // cach 2

MongoConnect.Connect()
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
      cors({
            origin: process.env.MODE === 'DEV' ? 'http://localhost:3000' : process.env.CLIENT_URL, // Cho phép truy cập từ origin này
            methods: ['GET', 'POST'], // Chỉ cho phép các phương thức GET và POST
            allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Chỉ
            credentials: true
      })
)

global._io.on('connection', SocketService.connection)
app.use('', router)

app.use((error: ErrorServer, req: Request, res: Response, next: NextFunction) => {
      return errorHandler(error, req, res, next)
})

server.listen(process.env.MODE === 'DEV' ? 4000 : process.env.PORT, () => {
      console.log('comming', process.env.MODE)
})
