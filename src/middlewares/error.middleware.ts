import {NextFunction, Request, Response} from "express";


export function errorMiddleware(err: any ,req: Request, res: Response, next: NextFunction) {
    const status: number = err.code || 500
    const message = err.message || "SERVER_INTERNAL_ERROR"

    return res.status(status).json({
        message,
        statusCode: status,
        success: false
    })
}