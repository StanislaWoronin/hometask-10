import {BlogType} from "../types/blogs-type";

export const blogOutputType = (blogDB: BlogType) => {
    return {
        id: blogDB.id,
        name: blogDB.name,
        youtubeUrl: blogDB.youtubeUrl,
        createdAt: blogDB.createdAt
    }
}