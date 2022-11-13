import {givePagesCount} from "./helperFunctions";
import {BlogsType} from "./types/blogs-type";
import {PostsType} from "./types/posts-type";
import {UsersType} from "./types/user-type";
import {CommentsType} from "./types/comment-type";

export const paginationContentPage = (pageNumber: string,
                                      pageSize: string,
                                      content: BlogsType | PostsType | UsersType | CommentsType,
                                      totalCount: number) => {

    const pageWithContent = {
        "pagesCount": givePagesCount(totalCount, pageSize),
        "page": Number(pageNumber),
        "pageSize": Number(pageSize),
        "totalCount": totalCount,
        "items": content
    }

    return pageWithContent
}