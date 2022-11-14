import mongoose from "mongoose";
import {BlogType} from "../types/blogs-type";

const blogScheme = new mongoose.Schema<BlogType>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    youtubeUrl: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const BlogSchema = mongoose.model('blogs', blogScheme)