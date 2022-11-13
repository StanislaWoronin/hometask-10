import {ObjectId, WithId,} from "mongodb";

export type CommentType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string
}

export type CommentsType = CommentType[]

export type CommentBDType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string,
    postId: string,
}