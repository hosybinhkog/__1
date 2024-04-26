import {HttpClientErrorReasonPhrases, HttpStatus} from "~/enums";


export class ErrorMessage extends Error {
    private code: number

    constructor({ message, status }: { message: string, status: number }) {
        super(message);
        this.code = status
    }
}

export class BadRequestResponse extends ErrorMessage {
    constructor({ message = HttpClientErrorReasonPhrases.BadRequest, status = HttpStatus.BAD_REQUEST }: { message?: string, status?: number }) {
        super({ message, status });
    }
}

export class NotFoundResponse extends ErrorMessage {
    constructor({ message = HttpClientErrorReasonPhrases.NotFound , status = HttpStatus.NOT_FOUND }: { message?: string, status?: number }) {
        super({ message, status });
    }
}