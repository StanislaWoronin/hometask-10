import {PostType} from "../types/posts-type";

export const postOutputType = (postsBD: PostType) => {
    return {
        id: postsBD.id,
        title: postsBD.title,
        shortDescription: postsBD.shortDescription,
        content: postsBD.content,
        blogId: postsBD.blogId,
        blogName: postsBD.blogName,
        createdAt: postsBD.createdAt
    }
}