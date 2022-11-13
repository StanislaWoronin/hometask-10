import {BlogSchema} from "./db";
import {BlogsType, BlogType} from "../types/blogs-type";
import {giveSkipNumber} from "../helperFunctions";

export const blogsRepository = {
    async createNewBlog(newBlog: BlogType): Promise<BlogType | null> {
        try {
            await BlogSchema.create(newBlog)
            return newBlog
        } catch (e) {
            return null
        }
    },

    async giveBlogs(searchNameTerm: string,
                    sortBy: string,
                    sortDirection: string,
                    pageNumber: string,
                    pageSize: string): Promise<BlogsType> {

        return BlogSchema
            .find({name: {$regex: searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip(giveSkipNumber(pageNumber, pageSize))
            .limit(Number(pageSize))
            .lean()
    },

    async giveTotalCount(searchNameTerm: string): Promise<number> {
        return BlogSchema.countDocuments({name: {$regex: searchNameTerm, $options: 'i'}})
    },

    async giveBlogById(id: string): Promise<BlogType | null> {
        return BlogSchema.findOne({id: id}, {projection: {_id: false}})
    },

    async updateBlog(blogId: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await BlogSchema.updateOne({id: blogId}, {$set: {name: name, youtubeUrl: youtubeUrl}})

        return result.matchedCount === 1
    },

    async deleteBlogById(blogId: string): Promise<boolean> {
        const result = await BlogSchema.deleteOne({id: blogId})

        return result.deletedCount === 1
    },

    async deleteAllBlogs(): Promise<boolean> {
        try {
            await BlogSchema.deleteMany({})
            return true
        } catch (e) {
            console.log('BlogModel => deleteAllBlogs =>', e)
            return false
        }
    }
}