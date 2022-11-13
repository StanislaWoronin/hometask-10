import {CommentsSchema} from "./db";
import {CommentBDType, CommentsType, CommentType} from "../types/comment-type";
import {giveSkipNumber} from "../helperFunctions";

export const commentsRepository = {
    async createNewComment(newComment: CommentBDType): Promise<CommentBDType | null> {
        try {
            await CommentsSchema.create(newComment)
            return newComment
        } catch (e) {
            return null
        }
    },

    async updateComment(commentId: string, comment: string): Promise<boolean> {
        const result = await CommentsSchema.updateOne({id: commentId}, {$set:{content: comment}})

        return result.modifiedCount === 1
    },

    async giveCommentById(commentId: string): Promise<CommentType | null> {
        const comment = await CommentsSchema.findOne({id: commentId}, {projection: {_id: false, postId: false}})

        if (!comment) {
            return null
        }

        return comment
    },

    async giveComments(sortBy: string,
                       sortDirection: 'asc' | 'desc',
                       pageNumber: string,
                       pageSize: string,
                       postId: string): Promise<CommentsType | null> {

        return CommentsSchema
            .find({postId: postId})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip(giveSkipNumber(pageNumber, pageSize))
            .limit(Number(pageSize))
            .lean()
    },

    async giveTotalCount(postId: string | undefined): Promise<number> {
        return CommentsSchema.countDocuments({postId: postId})
    },

    async deleteCommentById(commentId: string): Promise<boolean> {
        const result = await CommentsSchema.deleteOne({id: commentId})

        return result.deletedCount === 1
    },

    async deleteAllComments(): Promise<boolean> {
        try {
            await CommentsSchema.deleteMany({})
            return true
        } catch (e) {
            console.log('commentsCollection => deleteAllComments =>', e)
            return false
        }
    }
}