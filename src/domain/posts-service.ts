import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";
import {PostType} from "../types/posts-type";
import {ContentPageType} from "../types/content-page-type";

import {paginationContentPage} from "../paginationContentPage";
import {postOutputType} from "../dataMapping/toPostOutputType";

export const postsService = {
    async createNewPost(title: string,
                        shortDescription: string,
                        content: string,
                        blogId: string): Promise<PostType | null> {

        const newPost: PostType = {
            id: String(+new Date()),
            title,
            shortDescription,
            content,
            blogId,
            blogName: await this.giveBlogName(blogId),
            createdAt: new Date().toISOString()
        }

        const createdNewPost = await postsRepository.createNewPost(newPost)

        if (!createdNewPost) {
            return null
        }

        return postOutputType(createdNewPost)
    },

    async giveBlogName(id: string): Promise<string> {
        const blog = await blogsRepository.giveBlogById(id)

        if (!blog) {
            return ''
        }

        return blog.name
    },

    async givePostsPage(sortBy: string,
                        sortDirection: 'asc' | 'desc',
                        pageNumber: string,
                        pageSize: string,
                        blogId?: string): Promise<ContentPageType> {

        const content = await postsRepository.givePosts(sortBy, sortDirection, pageNumber, pageSize, blogId)
        const totalCount = await postsRepository.giveTotalCount(blogId)

        return paginationContentPage(pageNumber, pageSize, content, totalCount)
    },

    async givePostById(postId: string): Promise<PostType | null> {
        return await postsRepository.givePostById(postId)
    },

    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<boolean> {

        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },

    async deletePostById(id: string): Promise<boolean> {
        return await postsRepository.deletePostById(id)
    }
}