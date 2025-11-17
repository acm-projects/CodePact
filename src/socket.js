// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

let socket = null;

export function initSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true, // send cookies (cp_jwt)
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}
