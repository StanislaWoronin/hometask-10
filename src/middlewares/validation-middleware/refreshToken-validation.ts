import {NextFunction, Request, Response} from "express";
import {jwsService} from "../../application/jws-service";
import {usersService} from "../../domain/user-service";
import {securityService} from "../../domain/security-service";

export const refreshTokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    // Проверяем токен в блеклисте. Тк в токене у нас хранится айди девайса, по этому айди
    // достаем из бд информацию о девайсе, в которой к айди девайса привязан айди пользователя
    // и находим пользователя по айди

    if (!req.cookies.refreshToken) {
        return res.sendStatus(401)
    }

    const tokenInBlackList = await jwsService.checkTokenInBlackList(req.cookies.refreshToken)

    if (tokenInBlackList) {
        return res.sendStatus(401)
    }

    const tokenPayload = await jwsService.giveTokenPayload(req.cookies.refreshToken)

    if (!tokenPayload) {
        return res.sendStatus(401)
    }

    const user = await usersService.giveUserById(tokenPayload.userId)

    if (!user) {
        return res.sendStatus(401)
    }

    req.user = user
    req.body.tokenPayload = tokenPayload
    next()
}