import express, {Request, Response} from 'express'
import userRouter from "~/routes/users.route";


const mainRouter = express.Router()

mainRouter.get('/ping', (req: Request,  res: Response) => {
    return res.status(200).json({
        messsage: 'ping to serveir'
    })
})
mainRouter.use('/users', userRouter)

export default mainRouter