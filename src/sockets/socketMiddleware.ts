import AppError from "../utils/appError";
import { verifyAccessToken } from "../utils/token";

export const socketAuthMiddleware = async (socket: any, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new AppError("Authentication error", 401);

    const decoded = verifyAccessToken(token);
    socket.user = decoded;
    next();
  } catch (err: any) {
    next(err);
  }
};