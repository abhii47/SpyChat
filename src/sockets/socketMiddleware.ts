import AppError from "../utils/appError";
import logger from "../utils/logger";
import { verifyAccessToken } from "../utils/token";

export const socketAuthMiddleware = async (socket: any, next: any) => {
  try {
    const token = socket.handshake.query.token;
    if (!token){
      logger.warn("Socket Auth failed : token not found");
      throw new AppError("Authentication error", 401);
    }

    const decoded = verifyAccessToken(token);
    socket.user = decoded;
    next();
  } catch (err: any) {
    next(err);
  }
};