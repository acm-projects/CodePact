import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", { withCredentials: true });
  }
  console.log(socket);
  return socket;
};

export const getSocket = () => socket;