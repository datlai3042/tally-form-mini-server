"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.InputValidate = exports.InputHelper = void 0;
const response_error_1 = require("../Core/response.error");
class InputHelper {
    static typeNumber(input, errors = []) { }
    static typeEmail(input, errors = []) {
        if (InputValidate.typeEmail(input))
            return input;
        return errors.push(input.setting?.input_error);
    }
    static typeDate(input, errors) {
        if (InputValidate.typeDate(input))
            return input;
        // return errors.push(input.)
    }
}
exports.InputHelper = InputHelper;
class InputValidate {
    static typeNumber(input, errors = []) {
        // if()
        // return true ? true : errors.push('')
    }
    static typeEmail(input, errors = []) {
        const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;
        return input?.input_value?.match(regex);
    }
    static typeDate(input) {
        if (input.date_type === 'Any') {
            return input;
        }
        if (input.date_type === 'After') {
            return false;
        }
    }
}
exports.InputValidate = InputValidate;
const validateEmail = (email) => {
    const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;
    return email.match(regex);
};
exports.validateEmail = validateEmail;
const validateInputChecker = (input_data, input_condition_validate) => {
    const errors = [];
    const check = input_data.every((input) => {
        if (input.type === 'IMAGE' || input.type === 'Option')
            return;
        switch (input.type) {
            case 'EMAIL':
                return InputHelper.typeEmail(input, errors);
            case 'Date':
                return InputHelper.typeDate(input, errors);
            // case 'Number':
            //       return InputHelper.typeNumber(input, errors)
            default:
                return new response_error_1.NotFoundError({ metadata: 'Định dạng input không được hỗ trợ' });
        }
    });
    return check ? input_data : new response_error_1.BadRequestError({ metadata: errors });
};
exports.default = validateInputChecker;
