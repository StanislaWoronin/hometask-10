import mongoose from "mongoose";
import {UserIpAddressType} from "../types/UserIpAddress";

const ipAddressScheme = new mongoose.Schema<UserIpAddressType>({
    ipAddress: {type: String, required: true},
    endpoint: {type: String, required: true},
    connectionAt: {type: Number, required: true}
})

export const IpAddressScheme = mongoose.model('ipAddress', ipAddressScheme)