import { Response } from 'express'
import { ResSucess } from '~/type'
import statusCode from './statusCode'
import reasonCode from './reasonStatusCode'

class ResponseSuccess {
      private code: number
      private message: string
      private metadata: any

      constructor({ code = statusCode.OK, message = reasonCode.OK, metadata }: ResSucess) {
            this.code = code
            this.message = message
            this.metadata = metadata
      }

      send(res: Response) {
            return res.json(this)
      }
}

class CREATE extends ResponseSuccess {
      constructor({ code = statusCode.CREATED, message = reasonCode.CREATED, metadata = {} }: ResSucess) {
            super({ code, message, metadata })
      }
}

class OK extends ResponseSuccess {
      constructor({ code = statusCode.OK, message = reasonCode.OK, metadata = {} }: ResSucess) {
            super({ code, message, metadata })
      }
}

export { CREATE, ResponseSuccess, OK }
