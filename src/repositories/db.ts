import * as dotenv from "dotenv";
dotenv.config()

import mongoose from 'mongoose';
import {BlogType} from "../types/blogs-type";
import {CommentBDType} from "../types/comment-type";
import {DeviceSecurityType} from "../types/deviceSecurity-type";
import {EmailConfirmationType} from "../types/email-confirmation-type";
import {PostType} from "../types/posts-type";
import {TokenType} from "../types/token-type";
import {UserDBType} from "../types/user-type";
import {UserIpAddressType} from "../types/UserIpAddress";
///?maxPoolSize=20&w=majority TODO ???
const mongoUri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017'
const dbName = process.env.mongoDBName || 'blogPlatform'

export async function runDb() {
    try {
        await mongoose.connect(mongoUri, {dbName});
        console.log(`Connected successfully to mongo server: ${mongoUri}`)
    } catch {
        console.log('Can`t connect to db')
        await mongoose.disconnect()
    }
}