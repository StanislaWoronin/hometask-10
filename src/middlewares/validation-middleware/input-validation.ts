import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = errors.array({onlyFirstError: true}).map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })
        return res.status(400).json({errorsMessages: error})
    }

    next()
}