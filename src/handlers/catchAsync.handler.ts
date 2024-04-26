import {NextFunction, Request, Response} from "express";

export const catchAsyncHandler = (theFunction: (req: Request, res: Response, next: NextFunction) => void) => (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(theFunction(req, res, next)).catch(next)
}