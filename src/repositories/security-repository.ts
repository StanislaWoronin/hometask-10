import {SecurityScheme} from "./db";
import {DeviceSecurityType} from "../types/deviceSecurity-type";

export const securityRepository = {
    async createUserDevice(createDevice: DeviceSecurityType) {
        try {
            return SecurityScheme.create(createDevice)
        } catch (e) {
            return null
        }
    },

    async giveLastSeveralSessions(ipAddress: string, sessionsСount: number) {
        return SecurityScheme
            .find({'userDevice.ipAddress': ipAddress})
            .sort({['userDevice.iat']: 'desc'})
            .limit(sessionsСount)
            .lean()
    },

    async giveAllActiveSessions(userId: string) {
        return SecurityScheme
            .find({userId}, {projection: {_id: false}}).lean()
    },

    async giveDeviseById(deviceId: string) {
        return SecurityScheme
            .findOne({'userDevice.deviceId': deviceId}, {projection: {_id: false}})
    },

    async updateCurrentActiveSessions(deviceId: string, iat: string, exp: string): Promise<boolean> {
        const result = await SecurityScheme
            .updateOne({
                    'userDevice.deviceId': deviceId
                },
                {
                    $set: {'userDevice.iat': iat, 'userDevice.exp': exp}
                }
            )

        return result.matchedCount === 1
    },

    async deleteDeviceById(deviceId: string): Promise<boolean> {
        const result = await SecurityScheme.deleteOne({'userDevice.deviceId': deviceId})

        return result.deletedCount === 1
    },

    async deleteAllActiveSessions(userId: string, deviceId: string): Promise<boolean> {
        try {
            await SecurityScheme
                .deleteMany({userId, 'userDevice.deviceId': {$ne: deviceId}})
            return true
        } catch (e) {
            console.log('SecurityScheme => deleteAllActiveSessions =>', e)
            return false
        }
    },

    async deleteAll(): Promise<boolean> {
        try {
            await SecurityScheme.deleteMany({})
            return true
        } catch (e) {
            console.log('SecurityScheme => deleteAll =>', e)
            return false
        }
    }
}