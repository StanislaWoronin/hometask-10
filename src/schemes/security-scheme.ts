import mongoose from "mongoose";
import {DeviceSecurityType} from "../types/deviceSecurity-type";

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