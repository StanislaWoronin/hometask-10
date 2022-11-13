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
///?maxPoolSize=20&w=majority
const mongoUri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017'
const dbName = process.env.mongoDBName || 'blogPlatform'

const blogSchema = new mongoose.Schema<BlogType>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    youtubeUrl: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const BlogSchema = mongoose.model('blogs', blogSchema)

const commentsSchema = new mongoose.Schema<CommentBDType>({
    id: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const CommentsSchema = mongoose.model('comment', commentsSchema)

const ipAddressScheme = new mongoose.Schema<UserIpAddressType>({
    ipAddress: {type: String, required: true},
    endpoint: {type: String, required: true},
    connectionAt: {type: Number, required: true}
})

export const IpAddressScheme = mongoose.model('ipAddress', ipAddressScheme)

const emailConfirmScheme = new mongoose.Schema<EmailConfirmationType>({
    id: {type: String, required: true},
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: Boolean, required: true}
})

export const EmailConfirmationScheme = mongoose.model('emailConfirm', emailConfirmScheme)

const postsScheme = new mongoose.Schema<PostType>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const PostsScheme = mongoose.model('posts', postsScheme)

const securityScheme = new mongoose.Schema<DeviceSecurityType>({
    userId: {type: String, required: true},
    userDevice: {
        deviceId: {type: String, required: true},
        deviceTitle: {type: String, required: true},
        browser: {type: String, required: true},
        ipAddress: {type: String, required: true},
        iat: {type: String, required: true},
        exp: {type: String, required: true}
    }
})

export const SecurityScheme = mongoose.model('security', securityScheme)

const tokenBlackListScheme = new mongoose.Schema<TokenType>({
    refreshToken: {type: String, required: true}
})

export const TokenBlackListScheme = mongoose.model('blackList', tokenBlackListScheme)

const userScheme = new mongoose.Schema<UserDBType>({
    id: {type: String, required: true},
    login: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const UserScheme = mongoose.model('users', userScheme)

export async function runDb() {
    try {
        await mongoose.connect(mongoUri, {dbName});
        console.log(`Connected successfully to mongo server: ${mongoUri}`)
    } catch {
        console.log('Can`t connect to db')
        await mongoose.disconnect()
    }
}