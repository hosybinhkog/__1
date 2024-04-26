import dotenv from 'dotenv'
dotenv.config()
import {Collection, Db, MongoClient} from "mongodb";
import User from "~/models/schemas/User.schema";
import RefreshToken from "~/models/schemas/RefreshToken.schema";

const url = process.env.MONGODB_URL || ''

class DatabaseService {
    private client: MongoClient
    private db: Db
    constructor() {
        this.client = new MongoClient(url)
        this.db = this.client.db(process.env.DB_NAME || 'twitter')
        this.connect()
    }

    async connect(): Promise<void>{
        try {
            await this.db.command({ ping: 1 })
            console.log('connected to database')
        }catch (error){
            console.log(error)
            await this.client.close()
        } finally {

        }
    }

    get users():Collection<User> {
        return this.db.collection(process.env.USERS_COLLECTION || 'users')
    }

    get refreshTokens(): Collection<RefreshToken> {
        return this.db.collection(process.env.REFRESH_TOKENS_COLLECTION ||'refresh_tokens')
    }

    async deleteAllUsers(){
        await this.users.deleteMany({})
    }
}
const databaseService = new DatabaseService()
export default databaseService