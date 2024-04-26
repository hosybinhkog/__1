import {NextFunction, Request, Response} from "express";
import {BadRequestResponse, ErrorMessage, OkeResponse} from "~/response";
import {UserService} from "~/services";
import core from 'express-serve-static-core'
import {LoginReqBody, RegisterReqBody} from "~/models/requests";


export class UsersController {
    static async register(req: Request<core.ParamsDictionary, any, RegisterReqBody>, res: Response, next: NextFunction){
        const { password, confirm_password, date_of_birth } = req.body
        if(password !== confirm_password) throw new BadRequestResponse({ message: 'PASSWORD NOT MATCH CONFIRM PASSWORD' })
        const { token, newUser } = await UserService.register({ ...req.body, date_of_birth: new Date(date_of_birth) })
        const headers = [{ name: 'Authorization', value:token.accessToken} , { name: 'RefreshToken', value: token.refreshToken}]

        if(!newUser) throw new ErrorMessage({ message: 'SERVER WRONG', status: 500 })

        return new OkeResponse({
            metadata: {
                newUser,
                token
            },
            message: 'register successfully'
        }).send(res, headers)
    }

    static  async login(req: Request<core.ParamsDictionary, any, LoginReqBody>, res: Response, next: NextFunction) {
        const { password, email } = req.body
        const data = await UserService.login({ password, email})
        return new OkeResponse({
            metadata: {
                data
            }
        }).send(res)
    }

    static  async testVerifyToken(req: Request<core.ParamsDictionary, any, { token: string }>, res: Response, next: NextFunction){
        const token = await UserService.verifyToken({  token: req.body.token })
        return new OkeResponse({
            metadata: {
                token
            }
        }).send(res)
    }
}