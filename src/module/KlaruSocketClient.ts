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
import {KlaruClient} from "./features/KlaruClient";
import {KlaruServer} from "./features/KlaruServer";

export class KlaruSocketClient{
    public readonly connectionKey?: string;
    public readonly tag: string = "__null";
    private readonly httpServer: any;
    private _port: number;
    private _ip: string;
    private connection: any;
    private readonly client = new WebSocketClient();
    private connectionTime: number;
    private klaruServer: KlaruServer;
    private state: StateType;
    constructor(clientTag: string) {
        this.tag = clientTag;
    }

    private clients: KlaruClient[];
    private eventHandlers: any = {};
    private commands: any = {};
    private outcomingRequests: any = {}; // Req from serve
    public on <K extends keyof IEvents>(event: K, callback: (...args: IEvents[K]) => any): void{
        if(!this.eventHandlers[event])
            this.eventHandlers[event] = [];
        this.eventHandlers[event].push(callback);
    }
    public off <K extends keyof IEvents>(event: K, callback: (...args: IEvents[K]) => any): void{
        delete this.eventHandlers[event][this.eventHandlers[event].indexOf(callback)];
    }
    public subscribe(key: string, callback: ((message: MyRequestMessage) => any)){
        if(!this.commands[key])
            this.commands[key] = [];
        this.commands[key].push(callback);
    }
    public connect(port: number, ip: string = "127.0.0.1", connectionKey?: string): void{
        this.client.connect(`ws://${ip}:${port}`);
        this.client.on('connect', (connection: any) => {
            this.connection = connection;
            this.connectionTime = Date.now();
            this.state = "PREPARING";
            this.klaruServer = new KlaruServer();
            this.klaruServer.con = this.connection;
            if(this.eventHandlers["connection"]?.length > 0)
            {
                for(let k in this.eventHandlers["connection"])
                    this.eventHandlers["connection"][k](connection);
            }
            //Auth
            const authPacket: IPreparingMessage = {connectionKey, tag: this.tag}
            setTimeout(() => {
                connection.sendUTF(JSON.stringify({content: JSON.stringify(authPacket), type: 0} as IMessage))
                //console.log("auth")
            }, 250);
            setTimeout(() => {
                if(this.state != "CLOSE" && this.eventHandlers["auth"]?.length > 0)
                {
                    for(let k in this.eventHandlers["auth"])
                        this.eventHandlers["auth"][k]();
                }
            }, 500)
            connection.on('close', () => {
                this.state = "CLOSE"
                //console.log("Close")
            });
            connection.on('message', (content: any) => {
                const message = JSON.parse(content.utf8Data) as IMessage;
                this.onMessage(message);
            });


        });
    }
    public sendPacket(message: IMessage): void{
        this.connection.sendUTF(JSON.stringify(message));
    }
    public get(keyword: string, content: any): Promise<MyResponseMessage>{
        return new Promise<MyResponseMessage>(res => {
            const message: IRequestMessage = {content: JSON.stringify(content), sessionId: createUniqHash(), ttl: 3600, keyword};
            const timer = setTimeout(() => {
                const resMessage: IResponseMessage = {content: "__null", sessionId: message.sessionId, responseCode: "TIMEOUT"};
                const lateMessage = new MyResponseMessage(this.klaruServer, resMessage, message);
                res(lateMessage);
                delete this.outcomingRequests[message.sessionId];
            }, 3600);
            const privateCallback = (r: MyResponseMessage) => {
                clearTimeout(timer);
                res(r);
            }
            this.outcomingRequests[message.sessionId] = {
                callback: privateCallback,
                request: message
            }
            const cc = JSON.stringify(message);
            const packet: IMessage = {content: cc, type: 3};
            this.klaruServer.sendPacket(packet);
        })
    }
    private onMessage(message: IMessage): void{
        if(message.type == 1) //connection
        {
            if(this.eventHandlers["sys"]?.length > 0)
            {
                for(let k in this.eventHandlers["sys"])
                    this.eventHandlers["sys"][k](message);
            }
        }
        if(message.type >= 2 && message.type <= 4){
            // ---------------------------------------------sMESSAGES
            const myMessage = new MyMessage(this.klaruServer, message as IInfoMessage);
            if(message.type == 2){ //system
                for(let k in this.eventHandlers["info"])
                    this.eventHandlers["info"][k](myMessage);
            }else if(message.type == 3){ //request
                const req = JSON.parse(message.content) as IRequestMessage;
                if(Object.keys(this.commands).filter(x => x == req.keyword).length > 0)
                {
                    const requestMessage = new MyRequestMessage(this.klaruServer, req);
                    for(let i in this.commands[req.keyword])
                        this.commands[req.keyword][i](requestMessage);
                }else{
                    const resMessage: IResponseMessage = {content: "__null", sessionId: req.sessionId, responseCode: "TIMEOUT"};
                    const packet: IMessage = {content: JSON.stringify(resMessage), type: 4};
                    this.klaruServer.sendPacket(packet);
                }
            }else if(message.type == 4) { //response
                const response = JSON.parse(message.content) as IResponseMessage;
                let found = false;
                for(let k in Object.keys(this.outcomingRequests))
                    if(response.sessionId == Object.keys(this.outcomingRequests)[k])
                        found = true;

                if(found){
                    const res = new MyResponseMessage(this.klaruServer, response, this.outcomingRequests[response.sessionId].request as IRequestMessage);
                    this.outcomingRequests[response.sessionId].callback(res)
                    delete this.outcomingRequests[response.sessionId];
                }

            }
        }
    }

}