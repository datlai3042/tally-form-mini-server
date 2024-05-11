import reasonCode from '../Core/reasonStatusCode.js';
import statusCode from '../Core/statusCode.js';
const errorHandler = (error, req, res, next) => {
    console.log('errroHandle', JSON.parse(JSON.stringify(error.stack || 'Not')));
    const code = error.code ? error.code : statusCode.INTERNAL_SERVER_ERROR;
    const message = error.message ? error.message : reasonCode.INTERNAL_SERVER_ERROR;
    const metadata = error.metadata ? error.metadata : null;
    return res.status(code).send({ code, message, metadata });
};
export default errorHandler;
