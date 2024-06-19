"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.InputValidate = exports.InputHelper = void 0;
class InputHelper {
    static typeNumber(input, errors = []) { }
    static typeEmail(input, errors = []) {
        if (InputValidate.typeEmail(input))
            return input;
        // return errors.push(input.setting?.input_error as string)
    }
    static typeDate(input, errors) {
        // if (InputValidate.typeDate(input)) return input
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
}
exports.InputValidate = InputValidate;
const validateEmail = (email) => {
    const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;
    return email.match(regex);
};
exports.validateEmail = validateEmail;
const validateInputChecker = (input_data, input_condition_validate) => {
    const errors = [];
    // const check = input_data.every((input) => {
    //       if (input.type === 'Option') return
    //       switch (input.type) {
    //             case 'EMAIL':
    //                   return InputHelper.typeEmail(input, errors)
    //             // case 'Number':
    //             //       return InputHelper.typeNumber(input, errors)
    //             default:
    //                   return new NotFoundError({ metadata: 'Định dạng input không được hỗ trợ' })
    //       }
    // })
    // return check ? input_data : new BadRequestError({ metadata: errors })
};
exports.default = validateInputChecker;
