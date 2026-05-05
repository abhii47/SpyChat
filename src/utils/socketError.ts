import { Socket } from "socket.io";

export const emitSocketError = (socket: Socket, event: string, message: string) => {
    socket.emit("socket_error", { event, message });
};
