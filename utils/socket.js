// socket.js
import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "./utilFunctions";

export const socket = io(SOCKET_BASE_URL);
