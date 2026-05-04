import AppError from "../utils/appError";
import logger from "../utils/logger";
import { verifyAccessToken } from "../utils/token";

export const socketAuthMiddleware = async (socket: any, next: any) => {
  try {
    const token = socket.handshake.query?.token || socket.handshake.auth?.token;
    if (!token){
      logger.warn("Socket Auth failed : token not found");
      return next(new Error("authentication token missing"));
    }

    const decoded = verifyAccessToken(token);
    socket.user = decoded;
    next();
  } catch (err: any) {
    const isExpired = err.name === "TokenExpiredError";
    logger.warn("Socket Auth failed", {
      message:isExpired ? "Token Expired" : "Invalid Token",
    });
    return next(new Error(isExpired ? "Token Expired" : "Invalid Token"));
  }
};