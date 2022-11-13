import {IpAddressScheme} from "./db";

export const ipAddressRepository = {
    async createNewConnection(ip: string, endpoint: string, connectionAt: number) {
        return IpAddressScheme.create({ipAddress: ip, endpoint, connectionAt})
    },

    async giveConnectionCount(ip: string, endpoint: string, connectionAt: number) {
        return IpAddressScheme.countDocuments({ipAddress: ip, endpoint, connectionAt: {$gte: (connectionAt - 10000)}})
    },

    async deleteAll(): Promise<boolean> {
        try {
            await IpAddressScheme.deleteMany({})
            return true
        } catch (e) {
            console.log('IpAddressScheme => deleteAll =>', e)
            return false
        }
    }
}