import {validate} from "../validation/validation.js";
import {registerUserValidation} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponsesError} from "../error/responses-error.js";
import bcrypt from "bcrypt";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    // Check if username already exists
    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser > 0) {
        throw new ResponsesError(400, "Username already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });
}

export default {
    register
}