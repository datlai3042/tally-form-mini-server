import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ErrorServer } from './type'

import { config } from 'dotenv'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import router from './routers'
import cookieParser from 'cookie-parser'

import MongoConnect from './db/mongo.connect'
import errorHandler from './helpers/errorHandler'
import bodyParser from 'body-parser'

config()
const app = express()

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
            origin: process.env.CLIENT_URL, // Cho phép truy cập từ origin này
            methods: ['GET', 'POST'], // Chỉ cho phép các phương thức GET và POST
            allowedHeaders: ['Content-Type', 'Authorization'], // Chỉ
            credentials: true
      })
)

app.use('', router)

app.use((error: ErrorServer, req: Request, res: Response, next: NextFunction) => {
      return errorHandler(error, req, res, next)
})

app.listen(process.env.PORT, () => {
      console.log('comming')
})
