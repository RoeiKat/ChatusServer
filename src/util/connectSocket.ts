import { Server } from "socket.io";
import { IUser } from "../interfaces/User.interface";

interface ServerToClientEvents {
  emit: () => void;
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
  getUsers: (data: any) => void;
  newConversationEvent: (data: { initUser: string; otherUser: string }) => void;
  newMessageEvent: (data: { id: string }) => void;
}

interface SocketData {
  name: string;
  age: number;
  addUser: (data: any) => void;
  removeUser: (data: any) => void;
}

let io: Server<
  SocketData,
  InterServerEvents,
  ClientToServerEvents,
  ServerToClientEvents
>;

export const connectSocket = function (httpServer: any) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  return io;
};

export const getIO = function () {
  if (!io) {
    throw new Error("Socket not connected!");
  }
  return io;
};
