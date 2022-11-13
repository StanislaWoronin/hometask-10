import {body} from "express-validator";

export const nameValidation = body('name').isString().trim().isLength({min: 3, max: 15})
export const youtubeUrlValidation = body('youtubeUrl').isString().trim().isURL().isLength({min: 5, max: 100})