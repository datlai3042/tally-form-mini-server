import { ResError } from '~/type'
import statusCode from './statusCode'
import reasonCode from './reasonStatusCode'

export class ResponseError extends Error {
      code: number
      message: string
      metadata: string | any

      constructor({ code = statusCode.INTERNAL_SERVER_ERROR, message = reasonCode.INTERNAL_SERVER_ERROR, metadata }: ResError) {
            super(message)
            this.code = code
            this.message = message
            this.metadata = metadata
      }
}

export class BadRequestError extends ResponseError {
      constructor({ code = statusCode.BAD_REQUEST, message = reasonCode.BAD_REQUEST, metadata = '' }: ResError) {
            super({ code, message, metadata })
      }
}

export class AuthFailedError extends ResponseError {
      constructor({ code = statusCode.UNAUTHORIZED, message = reasonCode.UNAUTHORIZED, metadata = '' }: ResError) {
            super({ code, message, metadata })
      }
}

export class ForbiddenError extends ResponseError {
      constructor({ code = statusCode.FORBIDDEN, message = reasonCode.FORBIDDEN, metadata = '' }: ResError) {
            super({ code, message, metadata })
      }
}

export class NotFoundError extends ResponseError {
      constructor({ code = statusCode.NOT_FOUND, message = reasonCode.NOT_FOUND, metadata = '' }: ResError) {
            super({ code, message, metadata })
      }
}
