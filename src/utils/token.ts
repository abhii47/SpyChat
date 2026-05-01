import  jwt, { JwtPayload }  from "jsonwebtoken"
import { getEnv } from "../config/env"

export const generateAccessToken = (payload:Record<string, any>):string => {
    const secret = getEnv("JWT_ACCESS_SECRET");
    const token = jwt.sign(
        payload,
        secret,
        {expiresIn:"90m"}
    );
    return token;
}

export const generateRefreshToken = (payload:Record<string, any>):string => {
    const secret = getEnv("JWT_REFRESH_SECRET");
    const token = jwt.sign(
        payload,
        secret,
        {expiresIn:"7d"}
    );
    return token;
}

export const verifyAccessToken = (token:string):JwtPayload => {
    const secret = getEnv("JWT_ACCESS_SECRET");
    const verify = jwt.verify(token,secret);
    return verify as JwtPayload;
}

export const verifyRefreshToken = (token:string):JwtPayload => {
    const secret = getEnv("JWT_REFRESH_SECRET");
    const verify = jwt.verify(token,secret);
    return verify as JwtPayload;
}