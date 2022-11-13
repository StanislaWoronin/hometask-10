import {blogsRepository} from "../repositories/blogs-repository";
import {BlogType} from "../types/blogs-type";
import {ContentPageType} from "../types/content-page-type";
import {paginationContentPage} from "../paginationContentPage";
import {blogOutputType} from "../dataMapping/toBlogOutputType";

export const blogsService = {
    async createNewBlog(name: string, youtubeUrl: string): Promise<BlogType | null> {

        const newBlog: BlogType = {
            id: String(+new Date()),
            name: name,
            youtubeUrl: youtubeUrl,
            createdAt: new Date().toISOString()
        }

        const createdBlog = await blogsRepository.createNewBlog(newBlog)

        if (!createdBlog) {
            return null
        }

        return blogOutputType(createdBlog)
    },

    async giveBlogsPage(searchNameTerm: string,
                        sortBy: string,
                        sortDirection: string,
                        pageNumber: string,
                        pageSize: string): Promise<ContentPageType | null> {

        const blogs = await blogsRepository
            .giveBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)

        if (!blogs) {
            return null
        }

        const totalCount = await blogsRepository.giveTotalCount(searchNameTerm)

        return paginationContentPage(pageNumber, pageSize, blogs, totalCount)
    },

    async giveBlogById(blogId: string): Promise<BlogType | null> {
        return await blogsRepository.giveBlogById(blogId)
    },

    async updateBlog(blogId: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlog(blogId, name, youtubeUrl)
    },

    async deleteBlogById(blogId: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(blogId)
    },
}