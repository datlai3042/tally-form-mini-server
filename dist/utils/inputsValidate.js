import { BadRequestError, NotFoundError } from '../Core/response.error.js';
export class InputHelper {
    static typeNumber(input, errors = []) { }
    static typeEmail(input, errors = []) {
        if (InputValidate.typeEmail(input))
            return input;
        return errors.push(input.input_error);
    }
    static typeDate(input, errors) {
        if (InputValidate.typeDate(input))
            return input;
        return errors.push(input.input_error);
    }
}
export class InputValidate {
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
export const validateEmail = (email) => {
    const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;
    return email.match(regex);
};
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
                return new NotFoundError({ metadata: 'Định dạng input không được hỗ trợ' });
        }
    });
    return check ? input_data : new BadRequestError({ metadata: errors });
};
export default validateInputChecker;
