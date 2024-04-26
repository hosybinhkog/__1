import {HttpStatus} from "~/enums";
import { Response, Request } from 'express'


export class SuccessResponse {
    private message: string
    private statusCode?: number
    private metadata: object
    private success: boolean


    constructor({ message, statusCode = HttpStatus.OK, metadata = {} }: { message: string, statusCode?: number, metadata: object }) {
        this.message = message
        this.statusCode = statusCode
        this.metadata = metadata
        this.success = true
    }

    send(res: Response, headers?: { name: string, value: string }[]){
        if(headers){
            headers.forEach(header => {
                res.setHeader(header.name, header.value)
            })
        }
        res.status(this.statusCode || HttpStatus.OK).json(this)
    }
}


export class OkeResponse extends SuccessResponse {
    constructor({ message = "Success", metadata } : { message?: string, metadata: object }) {
        super({ message, metadata });
    }
}