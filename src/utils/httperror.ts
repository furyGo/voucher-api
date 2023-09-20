class HttpError extends Error {
    message: string
    statusCode: HttpStatusCode
    constructor (statusCode: HttpStatusCode, message: string) {
        super(message)
        this.statusCode = statusCode
    }
}

enum HttpStatusCode {
    BadRequest = 400,
    Forbidden = 403,
    NotFound = 404,
    InternalError = 500
}

export {
    HttpError,
    HttpStatusCode
}