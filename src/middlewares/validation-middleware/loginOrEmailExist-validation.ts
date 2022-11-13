import {NextFunction, Request, Response} from "express";
import {usersRepository} from "../../repositories/users-repository";

export const loginOrEmailExistValidation = async (req: Request, res: Response, next: NextFunction) => {
    const loginExist = await usersRepository.giveUserByLoginOrEmail(req.body.login)
    let error = []

    if (loginExist) {
        error.push('login')
    }

    const emailExist = await usersRepository.giveUserByLoginOrEmail(req.body.email)

    if (emailExist) {
        error.push('email')
    }

    if (error.length > 0) {
        const errorsMessages = []
        for (let i = 0; i < error.length; i++) {
            errorsMessages.push({message: `User with this ${error[i]} already exists`, field: error[i]})
        }

        return res.status(400).send({errorsMessages})
    }

    return next()
}