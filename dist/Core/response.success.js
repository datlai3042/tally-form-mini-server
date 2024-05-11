import statusCode from './statusCode.js';
import reasonCode from './reasonStatusCode.js';
class ResponseSuccess {
    code;
    message;
    metadata;
    constructor({ code = statusCode.OK, message = reasonCode.OK, metadata }) {
        this.code = code;
        this.message = message;
        this.metadata = metadata;
    }
    send(res) {
        return res.json(this);
    }
}
class CREATE extends ResponseSuccess {
    constructor({ code = statusCode.CREATED, message = reasonCode.CREATED, metadata = {} }) {
        super({ code, message, metadata });
    }
}
class OK extends ResponseSuccess {
    constructor({ code = statusCode.OK, message = reasonCode.OK, metadata = {} }) {
        super({ code, message, metadata });
    }
}
export { CREATE, ResponseSuccess, OK };
