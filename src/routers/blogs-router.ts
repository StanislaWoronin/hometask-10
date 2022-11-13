import {Response, Router} from "express";

import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";

import {BlogsCreateNewBlog} from "../models/blogsCreateNewBlog";
import {BlogsUpdateBlog} from "../models/blogsUpdateBlog";
import {QueryParameters} from "../models/queryParameters";
import {BlogsCreateNewPost} from "../models/blogCreateNewPost";
import {URIParameters} from "../models/URIParameters";

import {BlogType} from "../types/blogs-type";
import {PostType} from "../types/posts-type";
import {ContentPageType} from "../types/content-page-type";
import {RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery} from "../types/request-types";
import {
    createPostForBlogsRouterMiddleware, deleteBlogsRouterMiddleware,
    getBlogsRouterMiddleware, getPostForBlogsRouterMiddleware,
    postBlogsRouterMiddleware, putBlogsRouterMiddleware
} from "../middlewares/blogsRouterMiddleware";

export const blogsRouter = Router({})

blogsRouter.post('/',
    postBlogsRouterMiddleware,
    async (req: RequestWithBody<BlogsCreateNewBlog>,
           res: Response<BlogType>) => {

        const newBlog = await blogsService.createNewBlog(req.body.name, req.body.youtubeUrl)

        if (!newBlog) {
            return res.sendStatus(404)
        }

        res.status(201).send(newBlog)
    }
)

blogsRouter.post('/:id/posts', // blogId
    createPostForBlogsRouterMiddleware,
    async (req: RequestWithParamsAndBody<URIParameters, BlogsCreateNewPost>,
           res: Response<PostType>) => {

        const existsBlog = await blogsService.giveBlogById(req.params.id)

        if (!existsBlog) {
            return res.sendStatus(404)
        }

        const newPost = await postsService
            .createNewPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)

        res.status(201).send(newPost!)
    }
)

blogsRouter.get('/',
    ...getBlogsRouterMiddleware,
    async (req: RequestWithQuery<QueryParameters>,
           res: Response<ContentPageType>) => {

    const pageWithBlogs: ContentPageType | null = await blogsService
        .giveBlogsPage(req.query.searchNameTerm,
                       req.query.sortBy,
                       req.query.sortDirection,
                       req.query.pageNumber,
                       req.query.pageSize)

        if (!pageWithBlogs) {
            return res.sendStatus(404)
        }

        res.status(200).send(pageWithBlogs)
})

blogsRouter.get('/:id', // blogId
    async (req: RequestWithParams<URIParameters>,
                   res: Response<BlogType>) => {

    const blog = await blogsService.giveBlogById(req.params.id)

    if (!blog) {
        return res.sendStatus(404)
    }

    res.status(200).send(blog)
})

blogsRouter.get('/:id/posts',
    ...getPostForBlogsRouterMiddleware,
    async (req: RequestWithParamsAndQuery<URIParameters, QueryParameters>,
           res: Response<ContentPageType>) => {

    const blog: BlogType | null = await blogsService.giveBlogById(req.params.id)

    if (!blog) {
        return res.sendStatus(404)
    }

    const pageWithPosts = await postsService
        .givePostsPage(req.query.sortBy,
                       req.query.sortDirection,
                       req.query.pageNumber,
                       req.query.pageSize,
                       req.params.id)

    res.status(200).send(pageWithPosts)
})

blogsRouter.put('/:id',
    putBlogsRouterMiddleware,
    async (req: RequestWithParamsAndBody<URIParameters, BlogsUpdateBlog>,
           res: Response<BlogType | null>) => {

        const isUpdate = await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const blog = await blogsService.giveBlogById(req.params.id)
        return res.status(204).send(blog)
    }
)

blogsRouter.delete('/:id',
    deleteBlogsRouterMiddleware,
    async (req: RequestWithParams<URIParameters>, res: Response) => {

        const isDeleted = await blogsService.deleteBlogById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
)