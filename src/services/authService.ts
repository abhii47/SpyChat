import AppError from "../utils/appError";
import bcrypt from "bcryptjs";
import { User } from "../models";

type reqBody = {
    name:string,
    email:string,
    password:string,
    avatar:string,
}
export const register = async(body:reqBody) => {
    const { name,email,password,avatar } = body;

    if(!name || !email || !password || !avatar){
        throw new AppError("User Fields are  missing",400);
    }

    const hashPassword = await bcrypt.hash(password,10);
    
    const user = await User.create({
        name,
        email,
        password:hashPassword,
        avatar
    });

    return user;
}

export default {
    register
}