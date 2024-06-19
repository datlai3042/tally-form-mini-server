/* eslint-disable no-var */
export declare global {
      declare module globalThis {
            var _userSocket: { [key: string]: { socket_id: string } }
            var _io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
      }
}
