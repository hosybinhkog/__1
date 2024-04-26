export class ErrorHandler extends Error {
    private code: number
    constructor(message: string, code: number) {
        super(message);
        this.code = code

        Error.captureStackTrace(this, this.constructor)
    }
}