import {NextFunction, Request, Response} from "express";


export const authenticationGuard = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const validAuthHeader = 'Basic YWRtaW46cXdlcnR5'

    if(authHeader !== validAuthHeader) {
        res.sendStatus(401)
        return
    }

    next()
}

//const loginPass = 'admin:qwerty'
//const base64 = encoder(loginPass)
//const validAuthHeader = `Basic ${base64}`
// const base64 = new Buffer(loginPass, 'base64')
// -------------------------------------------------------------------------------------
// function encoder(str: string) {
//     return window.btoa(str);
// }
//
// function decoder(str: string) {
//     return window.atob('str')
// }