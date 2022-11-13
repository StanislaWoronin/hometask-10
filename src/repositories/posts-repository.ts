import {PostsScheme} from "./db";
import {PostsType, PostType} from "../types/posts-type";
import {giveSkipNumber} from "../helperFunctions";

export const postsRepository = {
    async createNewPost(newPost: PostType): Promise<PostType | null> {
        try {
            await PostsScheme.create(newPost)
            return newPost
        } catch (e) {
            return null
        }
    },

    async givePosts(sortBy: string,
                    sortDirection: 'asc' | 'desc',
                    pageNumber: string,
                    pageSize: string,
                    blogId: string | undefined): Promise<PostsType> {

        return PostsScheme
            .find({blogId: {$regex: blogId ? blogId : '', $options: 'i'}}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip(giveSkipNumber(pageNumber, pageSize))
            .limit(Number(pageSize))
            .lean()
    },

    async giveTotalCount(blogId: string | undefined): Promise<number> {
        return PostsScheme.countDocuments({blogId: {$regex: blogId ? blogId : '', $options: 'i'}})
    },

    async givePostById(postId: string): Promise<PostType | null> {
       return PostsScheme.findOne({id: postId}, {projection: {_id: false}})
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await PostsScheme.updateOne({id: id}, {$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})

        return result.matchedCount === 1
    },

    async deletePostById(id: string): Promise<boolean> {
        const result = await PostsScheme.deleteOne({id: id})

        return result.deletedCount === 1
    },

    async deleteAllPosts(): Promise<boolean> {
        try {
            await PostsScheme.deleteMany({})
            return true
        } catch (e) {
            console.log('postsCollection => deleteAllPosts =>', e)
            return false
        }
    }
}