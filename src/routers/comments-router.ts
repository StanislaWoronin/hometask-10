import {Response, Router} from "express";

import {commentsService} from "../domain/comments-servise";
import {CommentType} from "../types/comment-type";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/request-types";
import {URIParameters} from "../models/URIParameters";
import {deleteCommentsRouterMiddleware,
        putCommentsRouterMiddleware} from "../middlewares/commentsRouter-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id', // commentId
    async (req: RequestWithParams<URIParameters>,
           res: Response<CommentType>) => {

        const comment = await commentsService.giveCommentById(req.params.id)

        if (!comment) {
            return res.sendStatus(404)
        }

        return res.status(200).send(comment)
    }
)

commentsRouter.put('/:id', // commentId
    putCommentsRouterMiddleware,
    async(req: RequestWithParamsAndBody<URIParameters, CommentType>,
           res: Response<CommentType>) => {

        const isUpdate = await commentsService.updateComment(req.params.id, req.body.content)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const comment = await commentsService.giveCommentById(req.params.id)

        return res.status(204).send(comment!)
    }
)

commentsRouter.delete('/:id', // commentId
    deleteCommentsRouterMiddleware,
    async (req: RequestWithParams<URIParameters>,
           res: Response) => {

        const isDeleted = await commentsService.deleteCommentById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
)