import AppError from "../utils/appError";
import bcrypt from "bcryptjs";
import { User } from "../models";
import logger from "../utils/logger";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token";
import { redis } from "../config/redis";
import { uploadFile } from "../utils/uploadToCloudinary";
import { getEnv } from "../config/env";

type regBody = {
    name: string,
    email: string,
    password: string,
}
export const register = async (body: regBody, avatar: Express.Multer.File) => {
    const { name, email, password } = body;

    const avatarUrl = await uploadFile(avatar, getEnv("USER_FOLDER"), 'image');

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashPassword,
        avatar: avatarUrl.secure_url
    });

    //exclude password from user data 
    const userData = user.toJSON();
    const { password: _, ...safeUser } = userData;

    return safeUser;
}

type logBody = {
    email: string,
    password: string
}
type Payload = {
    id: number,
    email: string
}
export const login = async (body: logBody) => {
    const { email, password } = body;

    const user = await User.findOne({
        where: { email },
    });

    if (!user) {
        logger.warn("Login failed: user not found", { email });
        throw new AppError("Invalid email or password", 401);
    }

    const matchPassword = await bcrypt.compare(
        password, user.password
    );

    if (!matchPassword) {
        logger.warn("Password failed: password not matched");
        throw new AppError("Invalid email or password", 401);
    }

    const payload: Payload = {
        id: user.user_id,
        email: user.email,
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    //store refresh token on redis
    const key = `refresh:${user.user_id}`;
    await redis.set(key, refreshToken, "EX", 7 * 24 * 60 * 60);

    //exclude password from user data
    const userData = user.toJSON();
    const { password: _, ...safeUser } = userData;

    logger.info("User logged in", { userId: user.user_id });

    return { user: safeUser, accessToken, refreshToken }

}

export const refresh = async (refreshToken: string) => {

    if (!refreshToken) {
        logger.warn("Refresh token not found");
        throw new AppError("Refresh token not found", 401);
    }
    const decoded = verifyRefreshToken(refreshToken);

    const key = `refresh:${decoded.id}`;
    const storedToken = await redis.get(key);

    if (!storedToken) {
        logger.warn("refresh token not found in redis");
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const newAccessToken = generateAccessToken({
        id: decoded.id,
        email: decoded.email
    });

    logger.info("Access token refreshed", { userId: decoded.id });
    return { accessToken: newAccessToken };
}

export const logout = async (refreshToken: string) => {

    if (!refreshToken) {
        throw new AppError("Already logged Out", 400);
    }

    const decoded = verifyRefreshToken(refreshToken);

    const key = `refresh:${decoded.id}`;
    await redis.del(key);

    logger.info("User logged Out", { userId: decoded.id });
}

export const getMe = async (userId: number) => {

    const user = await User.findOne({
        where: { user_id: userId },
        attributes: { exclude: ["password", "deleted_at"] },
    });

    if (!user) {
        logger.warn("User not found");
        throw new AppError("User not found", 404);
    }

    return user;
}

export default {
    register,
    login,
    refresh,
    logout,
    getMe
}