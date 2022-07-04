import { KlaruClient } from "./features/KlaruClient";
import { IEvents } from "./features/interfaces/IEvents";
import { MyRequestMessage } from "./features/MyRequestMessage";
import { IRequestMessage } from "./features/interfaces/IRequestMessage";
import { MyResponseMessage } from "./features/MyResponseMessage";
export declare class KlaruSocketServer {
    connectionKey?: string;
    serverTag: string;
    private readonly httpServer;
    private _port;
    private _ip;
    private socket;
    constructor(serverTag?: string, connectionKey?: string);
    listen(port: number, ip: string, callback: (() => any)): void;
    private clients;
    private eventHandlers;
    private commands;
    private outcomingRequests;
    createRequest(client: KlaruClient, message: IRequestMessage, callback: ((message: MyResponseMessage) => any)): void;
    on<K extends keyof IEvents>(event: K, callback: (...args: IEvents[K]) => any): void;
    off<K extends keyof IEvents>(event: K, callback: (...args: IEvents[K]) => any): void;
    subscribe(key: string, callback: ((message: MyRequestMessage) => any)): void;
    private onConnectionRequest;
    private onMessage;
    getClients: () => KlaruClient[];
    private onSystemMessage;
    get ip(): string;
    get port(): number;
}
