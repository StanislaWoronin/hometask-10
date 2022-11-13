import {authenticationGuard} from "./validation-middleware/authentication-guard";
import {nameValidation,
        youtubeUrlValidation} from "./validation-middleware/blogRouter-validation";
import {contentValidation,
        shortDescriptionValidation,
        titleValidation} from "./validation-middleware/postRouter-validation";
import {inputValidation} from "./validation-middleware/input-validation";
import {pageNumberValidation,
        pageSizeValidation,
        searchNameTermValidation,
        sortByValidation,
        sortDirectionValidation} from "./validation-middleware/query-validation";

export const createPostForBlogsRouterMiddleware = [authenticationGuard, titleValidation, shortDescriptionValidation, contentValidation, inputValidation]
export const deleteBlogsRouterMiddleware = [authenticationGuard]
export const getBlogsRouterMiddleware = [sortByValidation, sortDirectionValidation, pageNumberValidation, pageSizeValidation, searchNameTermValidation, inputValidation]
export const getPostForBlogsRouterMiddleware = [sortByValidation, sortDirectionValidation, pageNumberValidation, pageSizeValidation, inputValidation]
export const postBlogsRouterMiddleware = [authenticationGuard, nameValidation, youtubeUrlValidation, inputValidation]
export const putBlogsRouterMiddleware = [authenticationGuard, nameValidation, youtubeUrlValidation, inputValidation]