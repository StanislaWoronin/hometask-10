import {UserDeviceType} from "./userDevice-type";

export type DeviceSecurityType = {
    userId: string,
    /**
     *  UserDeviceType: deviceId
     *                  deviceTitle
     *                  browser
     *                  ipAddress
     *                  iat
     *                  exp
     */
    userDevice: UserDeviceType
}