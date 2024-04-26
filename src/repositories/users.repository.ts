import User from "~/models/schemas/User.schema";
import databaseService from "~/dbs/mongo.dbs";

export class UsersRepository {
    static async findEmailExists(email: string):Promise<User | null> {
        return await databaseService.users.findOne({ email })
    }
}