import bcrypt from "bcrypt";
import add from "date-fns/add";
import {v4 as uuidv4} from 'uuid';
import {emailConfirmationRepository} from "../repositories/emailConfirmation-repository";
import {usersRepository} from "../repositories/users-repository";
import {emailsManager} from "../managers/email-manager";
import {UserAccountType} from "../types/user-account-type";
import {_generateHash} from "../helperFunctions";

export const authService = {
    async createUser(login: string, password: string, email: string, ipAddress: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await _generateHash(password, passwordSalt)
        const userAccountId = uuidv4()

        const userAccount: UserAccountType = {
            accountData: {
                id: userAccountId,
                login,
                email,
                passwordSalt,
                passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                id: userAccountId,
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 24
                    // minutes: 1,
                    // seconds: 1
                }),
                isConfirmed: false
            }
        }
        console.log('confirmationCode:', userAccount.emailConfirmation.confirmationCode)
        const createdAccount = await this.createUserAccount(userAccount)

        if (!createdAccount) {
            return null
        }

        const info = await emailsManager.sendConfirmationEmail(email, userAccount.emailConfirmation.confirmationCode)
        return {userAccount: createdAccount, info}
    },

    async confirmEmail(code: string): Promise<boolean> {
        const emailConfirmation = await this.giveEmailConfirmationByCodeOrId(code)

        if (!emailConfirmation) {
            return false
        }

        return await emailConfirmationRepository.updateConfirmationInfo(emailConfirmation.id)
    },

    async resendConfirmRegistration(email: string) {
        const user = await usersRepository.giveUserByLoginOrEmail(email)

        if (!user) {
            return null
        }

        const newConfirmationCode = uuidv4()
        const newExpirationDate = add(new Date(), {hours: 24})
        await emailConfirmationRepository.updateConfirmationCode(user.id, newConfirmationCode, newExpirationDate)

        const emailConfirmation = await this.giveEmailConfirmationByCodeOrId(user.id)

        if (!emailConfirmation) {
            return null
        }

        return await emailsManager.sendConfirmationEmail(email, newConfirmationCode)
    },

    async createUserAccount(userAccount: UserAccountType) {
        const user = await usersRepository.createNewUser(userAccount.accountData)
        const emailConfirmation = await emailConfirmationRepository.createEmailConfirmation(userAccount.emailConfirmation)

        if (!user || !emailConfirmation) {
            return null
        }

        return {accountData: user, emailConfirmation}
    },

    async giveEmailConfirmationByCodeOrId(codeOrId: string) {
        const emailConfirmation = await emailConfirmationRepository.giveEmailConfirmationByCodeOrId(codeOrId)

        if (!emailConfirmation) {
            return null
        }

        if (emailConfirmation!.expirationDate < new Date()) {
            return null
        }

        if (emailConfirmation!.isConfirmed) {
            return null
        }

        return emailConfirmation
    } // TODO переделать вся инфа в токене
}