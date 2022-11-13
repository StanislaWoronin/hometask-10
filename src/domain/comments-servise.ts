import {commentsRepository} from "../repositories/comments-repository";
import {CommentType} from "../types/comment-type";
import {UserDBType} from "../types/user-type";
import {ContentPageType} from "../types/content-page-type";

import {paginationContentPage} from "../paginationContentPage";
import {commentOutputType} from "../dataMapping/toCommentOutputType";

export const commentsService = {
    async createNewComment(postId: string, comment: string, user: UserDBType): Promise<CommentType | null> {
        const newComment = {
            id: String(+new Date()),
            content: comment,
            userId: user.id,
            userLogin: user.login,
            createdAt: new Date().toISOString(),
            postId: postId
        }

        const createdComment = await commentsRepository.createNewComment(newComment)

        if (!createdComment) {
            return null
        }

        return commentOutputType(createdComment)
    },

    async updateComment(commentId: string, comment: string): Promise<boolean> {
        return await commentsRepository.updateComment(commentId, comment)
    },

    async giveCommentById(commentId: string): Promise<CommentType | null> {

        const comment = await commentsRepository.giveCommentById(commentId)

        if (!comment) {
            return null
        }

        return comment
    },

    async giveCommentsPage(sortBy: string,
                           sortDirection: 'asc' | 'desc',
                           pageNumber: string,
                           pageSize: string,
                           userId: string): Promise<ContentPageType | null> {

        const commentsDB = await commentsRepository.giveComments(sortBy, sortDirection, pageNumber, pageSize, userId)

        if (!commentsDB!.length) {
            return null
        }

        const comments = commentsDB!.map(c => commentOutputType(c))
        const totalCount = await commentsRepository.giveTotalCount(userId)

        return paginationContentPage(pageNumber, pageSize, comments, totalCount)
    },

    async deleteCommentById(commentId: string): Promise<boolean> {
        return await commentsRepository.deleteCommentById(commentId)
    }
}