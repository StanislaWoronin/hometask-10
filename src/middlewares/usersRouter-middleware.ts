import {authenticationGuard} from "./validation-middleware/authentication-guard";
import {userEmailValidation,
        userLoginValidation,
        userPasswordValidation
} from "./validation-middleware/userRouter-validation";
import {inputValidation} from "./validation-middleware/input-validation";
import {pageNumberValidation,
        pageSizeValidation,
        searchEmailTermValidation,
        searchLoginTermValidation,
        sortByValidation,
        sortDirectionValidation} from "./validation-middleware/query-validation";

export const deleteUsersRouter = [authenticationGuard]
export const getUsersRouterMiddleware = [sortByValidation, sortDirectionValidation, pageNumberValidation, pageSizeValidation, searchEmailTermValidation, searchLoginTermValidation, inputValidation]
export const postUsersRouterMiddleware = [authenticationGuard, userLoginValidation, userPasswordValidation, userEmailValidation, inputValidation]