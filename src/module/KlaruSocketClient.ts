import {StateType} from "./features/Types";

let WebSocketClient = require('websocket').client;
const http = require('http');
import {createHash} from 'crypto';
import {IPreparingMessage} from "./features/interfaces/IPreparingMessage";
import {createUniqHash} from "./features/functions";
import {IMessage} from "./features/interfaces/IMessage";
import {ISystemMessage} from "./features/interfaces/ISystemMessage";
import {IEvents} from "./features/interfaces/IEvents";
import {MyMessage} from "./features/MyMessage";
import {IInfoMessage} from "./features/interfaces/IInfoMessage";
import {MyRequestMessage} from "./features/MyRequestMessage";
import {IRequestMessage} from "./features/interfaces/IRequestMessage";
import {MyResponseMessage} from "./features/MyResponseMessage";
import {IResponseMessage} from "./features/interfaces/IResponseMessage";

export class KlaruSocketClient{
    public readonly connectionKey?: string;
    public readonly tag: string = "__null";
    private readonly httpServer: any;
    private _port: number;
    private _ip: string;
    private connection: any;
    private readonly client = new WebSocketClient();
    private connectionTime: number;
    private state: StateType;
    constructor(clientTag: string) {
        this.tag = clientTag;
    }
    public connect(port: number, ip: string = "127.0.0.1", connectionKey?: string): void{
        this.client.connect(`ws://${ip}:${port}`);
        this.client.on('connect', (connection: any) => {
            this.connection = connection;
            this.connectionTime = Date.now();
            this.state = "PREPARING";
            //Auth
            const authPacket: IPreparingMessage = {connectionKey, tag: this.tag}
            setTimeout(() => connection.sendUTF(JSON.stringify(authPacket)), 250);

            connection.on('close', () => {
                this.state = "CLOSE"
            });
            connection.on('message', (message) => {

            });


        });
    }

}