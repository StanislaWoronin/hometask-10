import {authentication} from "./validation-middleware/authentication";
import {commentsValidation} from "./validation-middleware/commentRouter-validation";
import {inputValidation} from "./validation-middleware/input-validation";
import {notYourComment} from "./validation-middleware/notYourComment-validation";

export const deleteCommentsRouterMiddleware = [authentication, notYourComment]
export const putCommentsRouterMiddleware = [authentication, notYourComment, commentsValidation, inputValidation]