import {BlogsType} from "./blogs-type";
import {CommentsType} from "./comment-type";
import {PostsType} from "./posts-type";
import {UsersType} from "./user-type";

export type ContentPageType = {
    pagesCount: number, // всего страниц
    page: number, // номер страницы
    pageSize: number, // количество элементов на странице
    totalCount: number, // всего элементов
    items: BlogsType | PostsType | UsersType | CommentsType
}