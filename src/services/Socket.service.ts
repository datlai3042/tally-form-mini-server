import { Socket } from 'socket.io'

class SocketService {
      static async connection(socket: Socket) {
            console.log({ socket: socket.id, 1: 1 })
      }
}

export default SocketService
