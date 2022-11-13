import express from 'express'

import {authRouter} from "./routers/auth-router";
import {blogsRouter} from "./routers/blogs-router";
import {commentsRouter} from "./routers/comments-router";
import {postsRouter} from "./routers/posts-router"
import {securityRouter} from "./routers/security-router";
import {testingRouter} from "./routers/testing-router";
import {usersRouter} from "./routers/users-router";

import {runDb} from "./repositories/db";
import cookieParser from "cookie-parser";

export const app = express()

const port = process.env.PORT || 5000

app.set('trust proxy', true) // for get ip-address

app.use(cookieParser()) // add cookie-parser
app.use(express.json()) // add body-parser

app.use('/auth', authRouter)
app.use('/blogs', blogsRouter)
app.use('/comments', commentsRouter)
app.use('/posts', postsRouter)
app.use('/security', securityRouter)
app.use('/testing', testingRouter)
app.use('/users', usersRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()