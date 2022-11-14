import mongoose from "mongoose";
import {EmailConfirmationType} from "../types/email-confirmation-type";

const emailConfirmScheme = new mongoose.Schema<EmailConfirmationType>({
    id: {type: String, required: true},
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: Boolean, required: true}
}, {collection: 'emailConfirm'})

export const EmailConfirmationScheme = mongoose.model('emailConfirm', emailConfirmScheme)