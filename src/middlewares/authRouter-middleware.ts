import {authentication} from "./validation-middleware/authentication";
import {inputValidation} from "./validation-middleware/input-validation";
import {userEmailValidation,
        userLoginValidation,
        userPasswordValidation} from "./validation-middleware/userRouter-validation";
import {loginOrEmailExistValidation} from "./validation-middleware/loginOrEmailExist-validation";
import {checkCredential} from "./validation-middleware/checkCredential";
import {ipAddressLimiter} from "./validation-middleware/ipAddressLimiter";

export const getAuthRouterMiddleware = [authentication]
export const postAuthRouterMiddleware = [ipAddressLimiter, userPasswordValidation, inputValidation, checkCredential]
export const postRegistrationMiddleware = [ipAddressLimiter, userLoginValidation, userPasswordValidation, userEmailValidation, inputValidation, loginOrEmailExistValidation]
export const limiterAndEmailValidation = [ipAddressLimiter, userEmailValidation, inputValidation]
export const limiterAndPasswordValidation = [ipAddressLimiter, userPasswordValidation, inputValidation]