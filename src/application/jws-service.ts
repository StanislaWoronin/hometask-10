import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {jwtBlackList} from "../repositories/jwtBlackList";

export const jwsService = {
    async createJWT(userId: string, deviceId: string, timeToExpired: number) {
        return jwt.sign({userId, deviceId}, settings.JWT_SECRET, {expiresIn: `${timeToExpired}s`})
    },

    async giveTokenPayload(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            return result
        } catch (error) {
            return null
        }
    },

    async addTokenInBlackList(refreshToken: string) {
        return await jwtBlackList.addTokenInBlackList(refreshToken)
    },

    async checkTokenInBlackList(refreshToken: string) {
        return await jwtBlackList.giveToken(refreshToken)
    }
}