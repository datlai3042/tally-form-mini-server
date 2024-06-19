"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_utils_1 = require("../utils/token.utils");
class SocketService {
    static async connection(socket) {
        const clientId = (0, token_utils_1.getCookieValueHeader)('client_id', socket.request.headers.cookie);
        if (clientId && !global._userSocket[clientId]) {
            global._userSocket[clientId] = { socket_id: socket.id };
        }
        socket.on('disconnect', () => {
            delete global._userSocket[clientId];
            console.log({ user: global._userSocket, id: socket.id });
        });
        socket.on('checkError', (data) => console.log({ data }));
        socket.emit('mai', { id: socket.id });
        console.log({ user1: global._userSocket, id: socket.id });
    }
}
exports.default = SocketService;
