import { ResError } from '~/type'
import statusCode from './statusCode'
import reasonCode from './reasonStatusCode'

export class ResponseError extends Error {
      code: number
      message: string
      detail: string

      constructor({ code = statusCode.INTERNAL_SERVER_ERROR, message = reasonCode.INTERNAL_SERVER_ERROR, detail }: ResError) {
            super(message)
            this.code = code
            this.message = message
            this.detail = detail
      }
}

export class BadRequestError extends ResponseError {
      constructor({ code = statusCode.BAD_REQUEST, message = reasonCode.BAD_REQUEST, detail = '' }: ResError) {
            super({ code, message, detail })
      }
}

export class AuthFailedError extends ResponseError {
      constructor({ code = statusCode.UNAUTHORIZED, message = reasonCode.UNAUTHORIZED, detail = '' }: ResError) {
            super({ code, message, detail })
      }
}

export class ForbiddenError extends ResponseError {
      constructor({ code = statusCode.FORBIDDEN, message = reasonCode.FORBIDDEN, detail = '' }: ResError) {
            super({ code, message, detail })
      }
}

export class NotFoundError extends ResponseError {
      constructor({ code = statusCode.NOT_FOUND, message = reasonCode.NOT_FOUND, detail = '' }: ResError) {
            super({ code, message, detail })
      }
}
