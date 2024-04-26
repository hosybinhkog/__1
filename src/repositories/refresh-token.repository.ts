import {RefreshTokenType} from "~/models/schemas";
import databaseService from "~/dbs/mongo.dbs";
import RefreshToken from "~/models/schemas/RefreshToken.schema";
import {ObjectId} from "mongodb";

export class RefreshTokenRepository {

    static  async deleteAllTokensUserIsUsed(id: ObjectId) {
        return await databaseService.refreshTokens.deleteMany({ user_id: id })
    }
    static async insert(token: RefreshTokenType){
        return await databaseService.refreshTokens.insertOne(new RefreshToken(token))
    }

    static async insertRegisterOrLoginUser(token: RefreshTokenType){
        await this.deleteAllTokensUserIsUsed(token.user_id)
        return await databaseService.refreshTokens.insertOne(new RefreshToken(token))
    }
}