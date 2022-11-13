import {NextFunction, Request, Response} from "express";
import {ipAddressRepository} from "../../repositories/ipAddress-repository";

export const ipAddressLimiter = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const endpoint = req.url
    const connectionAt = Date.now()

    await ipAddressRepository.createNewConnection(ip, endpoint, connectionAt)
    const connectionsCount = await ipAddressRepository.giveConnectionCount(ip, endpoint, connectionAt)

    if (connectionsCount > 5) {
        return res.sendStatus(429)
    }

    return next()
}