import {Request, Response, NextFunction} from "express";
import {UserDBType} from "../../types/user-type";
import {usersRepository} from "../../repositories/users-repository";
import bcrypt from "bcrypt";

export const checkCredential = async (req: Request, res: Response, next: NextFunction) => {

    const user: UserDBType | null = await usersRepository.giveUserByLoginOrEmail(req.body.login)

    if (!user) {
        return res.sendStatus(401)
    }

    const passwordEqual = await bcrypt.compare(req.body.password, user!.passwordHash)

    if (!passwordEqual) {
        return res.sendStatus(401)
    }

    req.user = user
    return next()
}