import {body} from "express-validator";

export const userLoginValidation = body('login').isString().trim().isLength({min: 3, max: 10})
export const userPasswordValidation = body('password').isString().trim().isLength({min: 6, max: 20})
export const userEmailValidation = body('email').isString().trim().isEmail()