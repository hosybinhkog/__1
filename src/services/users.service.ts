import databaseService from "~/dbs/mongo.dbs";
import User from "~/models/schemas/User.schema";
import {LoginReqBody, RegisterReqBody} from "~/models/requests";
import {InsertOneResult, ObjectId} from "mongodb";
import {hashPassword, signToken, verifyToken} from "~/utils";
import {Secret} from "jsonwebtoken";
import * as process from "node:process";
import {TokenType} from "~/enums";
import {RefreshTokenRepository, UsersRepository} from "~/repositories";
import {NotFoundResponse} from "~/response";
import RefreshToken from "~/models/schemas/RefreshToken.schema";


export class UserService {
    static verifyToken({ token, secret = process.env.ACCESS_TOKEN_SECRET_PUB || '' }: { token: string, secret?: Secret }) {
        return verifyToken({ token, publicOrSecretKey: secret })
    }
    static signAccessToken({ payload, secret = process.env.ACCESS_TOKEN_SECRET_PRIVATE || '' }: { payload: string | Buffer | object, secret?: Secret }){
        return signToken({ payload, privateOrSecretKey: secret, options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
                algorithm: 'RS512'
            }})
    }

    static signRefreshToken({ payload, secret = process.env.REFRESH_TOKEN_SECRET_PRIVATE || '' } : { payload: string | Buffer | object, secret?: Secret }){
        return signToken({ payload, privateOrSecretKey: secret, options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '10d',
                algorithm: 'RS512'
            }})
    }
    static  async register(payload: RegisterReqBody):Promise<{ newUser: InsertOneResult<User>, token: { accessToken: string, refreshToken: string } }> {
        const { email, password, date_of_birth, name } = payload
        const newUser = await databaseService.users.insertOne(
            new User({
                email,
                password: hashPassword(password),
                date_of_birth: new Date(date_of_birth),
                name
            }),
        )

        const [accessToken, refreshToken] = await  Promise.all([this.signAccessToken({ payload: { id: newUser.insertedId, token_type: TokenType.AccessToken } }), this.signRefreshToken({ payload: { id: newUser.insertedId, token_type: TokenType.RefreshToken } })])
        await RefreshTokenRepository.insertRegisterOrLoginUser(new RefreshToken({ token: refreshToken, user_id: newUser.insertedId }))
        return { newUser, token:  {  refreshToken, accessToken } }
    }

    static  async login(payload: LoginReqBody) {
        const { email, password } = payload

        const user = await UsersRepository.findEmailExists(email)
        if(!user) throw new NotFoundResponse({ message: 'USER NOT FOUND '})
        if(user.password!== hashPassword(password)) throw new NotFoundResponse({ message: 'WRONG PASSWORD'})

        const [accessToken, refreshToken] = await Promise.all([this.signAccessToken({ payload: { id: user._id, token_type:TokenType.AccessToken } }), this.signRefreshToken({ payload: { id: user._id, token_type: TokenType.RefreshToken } })])
        await RefreshTokenRepository.insertRegisterOrLoginUser(new RefreshToken({ token: refreshToken, user_id: user._id as ObjectId  }))

        return { user: { ...user, password: undefined }, token: { accessToken, refreshToken} }
    }
}