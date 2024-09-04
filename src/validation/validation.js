import {ResponsesError} from "../error/responses-error.js";

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false
    });
    if (result.error) {
        throw new ResponsesError(400, result.error.message)
    } else {
        return result.value
    }
}

export {
    validate
}