import {EmailConfirmationScheme} from "./db";
import {EmailConfirmationType} from "../types/email-confirmation-type";

export const emailConfirmationRepository = {
    async createEmailConfirmation(emailConfirmation: EmailConfirmationType) {
        try {
            await EmailConfirmationScheme.create(emailConfirmation)
            return emailConfirmation
        } catch (e) {
            return null
        }
    },

    async giveEmailConfirmationByCodeOrIdOrEmail(codeOrIdOrEmail: string): Promise<EmailConfirmationType | null> {
        return EmailConfirmationScheme
            .findOne({$or:
                    [{confirmationCode: codeOrIdOrEmail}, {id: codeOrIdOrEmail}, {email: codeOrIdOrEmail}]},
                    {projection:{_id: false}})
    },

    async updateConfirmationCode(id: string, confirmationCode: string) {
        let result = await EmailConfirmationScheme
            .updateOne({id}, {$set: {confirmationCode}})

        return result.modifiedCount === 1
    },

    async updateConfirmationInfo(id: string) {
        let result = await EmailConfirmationScheme
            .updateOne({id}, {$set: {isConfirmed: true}})

        return result.modifiedCount === 1
    },

    async deleteAllEmailConfirmation(): Promise<boolean> {
        try {
            await EmailConfirmationScheme.deleteMany({})
            return true
        } catch (e) {
            console.log('EmailConfirmationScheme => deleteAll =>', e)
            return false
        }
    }
}