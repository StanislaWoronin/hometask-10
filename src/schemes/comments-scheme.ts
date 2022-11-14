import mongoose from "mongoose";
import {CommentBDType} from "../types/comment-type";

const commentsScheme = new mongoose.Schema<CommentBDType>({
    id: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const CommentsSchema = mongoose.model('comment', commentsScheme)