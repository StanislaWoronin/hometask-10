import {CommentType} from "../types/comment-type";

export const commentOutputType = (commentBD: CommentType) => { // непонимаю передаю БД тип, а писать нужно обычный
    return {
        id: commentBD.id,
        content: commentBD.content,
        userId: commentBD.userId,
        userLogin: commentBD.userLogin,
        createdAt: commentBD.createdAt
    }
}