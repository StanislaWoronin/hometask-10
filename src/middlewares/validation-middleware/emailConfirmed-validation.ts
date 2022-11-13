import {body} from "express-validator";
import {usersRepository} from "../../repositories/users-repository";
import {emailConfirmationRepository} from "../../repositories/emailConfirmation-repository";

export const emailConfirmedValidation = body('email').isString().trim().isEmail()
    .custom(async (email: string) => {
        const user = await usersRepository.giveUserByLoginOrEmail(email)

        if (!user) {
            throw new Error('User with this email does not exist')
        }

        const emailConfirmation = await emailConfirmationRepository.giveEmailConfirmationByCodeOrIdOrEmail(user.id)

        if (!emailConfirmation) {
            throw new Error('User with this email does not exist')
        }

        if (emailConfirmation!.expirationDate < new Date()) {
            throw new Error('The user\'s email has not been verified. Please try to register again')
        }

        if (emailConfirmation!.isConfirmed) {
            throw new Error('User with this email is already verified')
        }

        return true
    })