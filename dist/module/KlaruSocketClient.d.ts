import { IMessage } from "./features/interfaces/IMessage";
import { IEvents } from "./features/interfaces/IEvents";
import { MyRequestMessage } from "./features/MyRequestMessage";
import { MyResponseMessage } from "./features/MyResponseMessage";
export declare class KlaruSocketClient {
    readonly connectionKey?: string;
    readonly tag: string;
    private readonly httpServer;
    private _port;
    private _ip;
    private connection;
    private readonly client;
    private connectionTime;
    private klaruServer;
    private state;
    constructor(clientTag: string);
    private clients;
    private eventHandlers;
    private commands;
    private outcomingRequests;
    on<K extends keyof IEvents>(event: K, callback: (...args: IEvents[K]) => any): void;
    off<K extends keyof IEvents>(event: K, callback: (...args: IEvents[K]) => any): void;
    subscribe(key: string, callback: ((message: MyRequestMessage) => any)): void;
    connect(port: number, ip?: string, connectionKey?: string): void;
    sendPacket(message: IMessage): void;
    get(keyword: string, content: any): Promise<MyResponseMessage>;
    private onMessage;
}
