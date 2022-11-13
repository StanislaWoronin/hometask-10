import {DeviceSecurityType} from "../types/deviceSecurity-type";

export const activeSessionsOutputType = (device: DeviceSecurityType) => {
    return {
        deviceId: device.userDevice.deviceId,
        title: device.userDevice.deviceTitle,
        ip: device.userDevice.ipAddress,
        lastActiveDate: new Date(Number(device.userDevice.iat)).toISOString()
    }
}