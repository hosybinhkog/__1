import dotenv from 'dotenv'
import express, {Request, Response} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import mainRouter from "~/routes";
import {NotFoundResponse} from "~/response";
import {errorMiddleware} from "~/middlewares/error.middleware";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(morgan("dev"))
app.use(express.json({ limit: '19mb' }))
app.use(express.urlencoded({ extended: true, limit: '19mb' }))

app.use(cors({
    origin: 'http://localhost:3333',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}))
app.use(cookieParser())
app.use(compression())

app.use('/api/v1/', mainRouter)

app.use('*', (_req: Request, _res: Response) => { throw new NotFoundResponse({}) })
app.use(errorMiddleware)

app.listen(PORT, () => console.log(`server running on port:::: http://localhost:${PORT}`))