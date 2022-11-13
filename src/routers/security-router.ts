import {Request, Response, Router} from "express";
import {securityService} from "../domain/security-service";
import {refreshTokenValidation} from "../middlewares/validation-middleware/refreshToken-validation";

export const securityRouter = Router({})

securityRouter.get('/devices',
    refreshTokenValidation,
    async (req: Request, res: Response) => {
        const activeSessions = await securityService.giveAllActiveSessions(req.user!.id) // can check and send 404

        return res.status(200).send(activeSessions)
    }
)

securityRouter.delete('/devices',
    refreshTokenValidation,
    async (req: Request, res: Response) => {
        const result = await securityService.deleteAllActiveSessions(req.user!.id, req.body.tokenPayload.deviceId)

        if (!result) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
)

securityRouter.delete('/devices/:deviceId',
    refreshTokenValidation,
    async (req: Request, res: Response) => {

        const userDevice = await securityService.giveDeviceById(req.params.deviceId)

        if (!userDevice) {
            return res.sendStatus(404)
        }

        if (userDevice.userId !== req.user!.id) {
            return res.sendStatus(403)
        }

        const isDeleted = await securityService.deleteDeviceById(req.params.deviceId)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
)