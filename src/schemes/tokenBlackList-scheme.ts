import mongoose from "mongoose";
import {TokenType} from "../types/token-type";

const tokenBlackListScheme = new mongoose.Schema<TokenType>({
    refreshToken: {type: String, required: true}
})

export const TokenBlackListScheme = mongoose.model('blackList', tokenBlackListScheme)