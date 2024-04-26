import {ContextRunner, ValidationChain, validationResult} from "express-validator";
import {Response,Request,NextFunction} from "express";
import {HttpClientErrorReasonPhrases, HttpStatus} from "~/enums";
import {RunnableValidationChains} from "express-validator/src/middlewares/schema";


export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await validation.run(req)
        const errors = validationResult(req)

        if(errors.isEmpty()){
            return next()
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            message: HttpClientErrorReasonPhrases.BadRequest,
            errors: errors.mapped(),
            success: false
        })
    }
}