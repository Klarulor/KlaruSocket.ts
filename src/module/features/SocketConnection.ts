import { WebSocketConnection } from "./Types";

export class SocketConnection{
    public readonly connection: WebSocketConnection;
    public readonly id: string;

    public send(key: string, body: any | string): void{

    }
    public get(key: string, body: any | string): Promise<ISocketRequestResponse>{

    }
}