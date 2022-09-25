import {SocketSlave} from "./SocketSlave";

export type WebSocketConnection = any | string;

export type SocketConnectionState = "CONNECTED" | "LOST" | "DISPOSED";

export type KlaruSocketSender = SocketSlave | null;