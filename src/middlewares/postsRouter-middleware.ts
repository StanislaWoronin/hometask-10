import {authentication} from "./validation-middleware/authentication";
import {authenticationGuard} from "./validation-middleware/authentication-guard";
import {blogIdValidation,
        contentValidation,
        shortDescriptionValidation,
        titleValidation} from "./validation-middleware/postRouter-validation";
import {commentsValidation} from "./validation-middleware/commentRouter-validation";
import {inputValidation} from "./validation-middleware/input-validation";
import {pageNumberValidation,
        pageSizeValidation,
        sortByValidation,
        sortDirectionValidation} from "./validation-middleware/query-validation";

export const createCommentForPostsRouterMiddleware = [authentication, commentsValidation, inputValidation]
export const deletePostsRouterMiddleware = [authenticationGuard]
export const getPostsRouterMiddleware = [sortByValidation, sortDirectionValidation, pageNumberValidation, pageSizeValidation, inputValidation]
export const postsRouterMiddleware = [authenticationGuard, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidation]