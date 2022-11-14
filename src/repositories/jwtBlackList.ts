import {TokenBlackListScheme} from "../schemes/tokenBlackList-scheme";

export const jwtBlackList = {
    async addTokenInBlackList(refreshToken: string) {
        return TokenBlackListScheme.create({refreshToken})
    },

    async giveToken(refreshToken: string) {
        return TokenBlackListScheme.findOne({refreshToken})
    },

    async deleteAll(): Promise<boolean> {
        try {
            await TokenBlackListScheme.deleteMany({})
            return true
        } catch (e) {
            console.log('TokenBlackListScheme => deleteAll =>', e)
            return false
        }
    }
}