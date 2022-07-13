import {KlaruClient} from "./features/KlaruClient";

const WebSocketServer = require('websocket').server;
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

export class KlaruSocketServer{
    public connectionKey?: string;
    public serverTag: string = "__null";
    private readonly httpServer: any;
    private _port: number;
    private _ip: string;
    private socket: any;
    constructor(serverTag: string = "server", connectionKey?: string) {
        this.serverTag = serverTag;
        this.connectionKey = connectionKey;

        this.httpServer = http.createServer((request: any, response: { writeHead: (arg0: number) => void; end: () => void; }) => {
            //console.log((new Date()) + ' Received request for ' + request.url);
            response.writeHead(404);
            response.end();
        });
    }
    public listen(port: number, ip: string, callback: (() => any)): void{
        this._ip = ip;
        this._port = port;

        if (this.ip != undefined) {
            this.httpServer.listen(this.port, this.ip, callback);
        } else
            this.httpServer.listen(this.port, callback);
        this.socket = new WebSocketServer({
            httpServer: this.httpServer,
            autoAcceptConnections: false
        });

        this.socket.on('request', (req: any) => this.onConnectionRequest(req));

    }
    private clients: KlaruClient[] = [];
    private eventHandlers: any = {};
    private commands: any = {};
    private outcomingRequests: any = {}; // Req from server
    public createRequest(client: KlaruClient, message: IRequestMessage, callback: ((message: MyResponseMessage) => any)): void{
        const timer = setTimeout(() => {
            const resMessage: IResponseMessage = {content: "__null", sessionId: message.sessionId, responseCode: "TIMEOUT"};
            const lateMessage = new MyResponseMessage(client, resMessage, message);
            callback(lateMessage);
            delete this.outcomingRequests[message.sessionId];
        }, message.ttl);
        const privateCallback = (res: MyResponseMessage) => {
            clearTimeout(timer);
            callback(res)
        }
        this.outcomingRequests[message.sessionId] = {
            callback: privateCallback,
            request: message
        }
        const content = JSON.stringify(message);
        const packet: IMessage = {content, type: 3};
        client.sendPacket(packet);
    }
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
    private onConnectionRequest(request: any): void{
        const connection = request.accept();
        let current: KlaruClient = undefined;
        if(this.eventHandlers["connection"]?.length > 0)
        {
            for(let k in this.eventHandlers["connection"])
                this.eventHandlers["connection"][k](connection);
        }
        setTimeout(() => {
            if(!current)
                connection.close();
        }, 1000);

        connection.on('message', async (msg: any) => {
            const content: string = msg.utf8Data;
            try{
                const message = JSON.parse(content) as IMessage;
                if(current && current.authorized === true) {
                    this.onMessage(current, message);
                }else{
                    if (message.type === 0) {
                        const prepStruct = JSON.parse(message.content) as IPreparingMessage;
                        if(!this.connectionKey || (this.connectionKey && this.connectionKey == prepStruct.connectionKey)){
                            current = new KlaruClient(this, connection, createUniqHash(), prepStruct.tag);
                            current.authorized = true;
                            current.loginTime = Date.now();
                            this.clients.push(current);
                            if(this.eventHandlers["auth"]?.length > 0)
                            {
                                for(let k in this.eventHandlers["auth"])
                                    this.eventHandlers["auth"][k](current);
                            }
                        }
                    }
                }
            }catch(exc) {
                console.error(exc)
                if(this.eventHandlers["close"]?.length > 0)
                {
                    for(let k in this.eventHandlers["close"])
                        this.eventHandlers["close"][k](connection);
                }
                connection.close();

            }
        });

        connection.on('close',  (reasonCode: any, description: any) => {
            if(current){
                console.debug(current.uid)
                if(this.eventHandlers["close"]?.length > 0)
                {
                    for(let k in this.eventHandlers["close"])
                        this.eventHandlers["close"][k](current);
                }
                delete this.clients[this.clients.indexOf(current)];
            }
        });
    }
    private onMessage(client: KlaruClient, message: IMessage): void{
        if(message.type == 1) //connection
        {
            this.onSystemMessage(client, JSON.parse(message.content) as ISystemMessage);
            if(this.eventHandlers["sys"]?.length > 0)
            {
                for(let k in this.eventHandlers["sys"])
                    this.eventHandlers["sys"][k](message);
            }
        }
        if(message.type >= 2 && message.type <= 4){
            // ---------------------------------------------sMESSAGES
            const myMessage = new MyMessage(client, message as IInfoMessage);
            if(message.type == 2){ //system
                for(let k in this.eventHandlers["info"])
                    this.eventHandlers["info"][k](myMessage);
            }else if(message.type == 3){ //request
                const req = JSON.parse(message.content) as IRequestMessage;
                if(Object.keys(this.commands).filter(x => x == req.keyword).length > 0)
                {
                    const requestMessage = new MyRequestMessage(client, req);
                    for(let i in this.commands[req.keyword])
                        this.commands[req.keyword][i](requestMessage);
                }else{
                    const resMessage: IResponseMessage = {content: "__null", sessionId: req.sessionId, responseCode: "TIMEOUT"};
                    const packet: IMessage = {content: JSON.stringify(resMessage), type: 4};
                    client.sendPacket(packet);
                }
            }else if(message.type == 4) { //response
                const response = JSON.parse(message.content) as IResponseMessage;
                let found = false;
                for(let k in Object.keys(this.outcomingRequests))
                    if(response.sessionId === Object.keys(this.outcomingRequests)[k])
                        found = true;
                //console.log("Found: ", found, response.sessionId, Object.keys(this.outcomingRequests))
                if(found){
                    const res = new MyResponseMessage(client, response, this.outcomingRequests[response.sessionId].request as IRequestMessage);
                    this.outcomingRequests[response.sessionId].callback(res)
                    delete this.outcomingRequests[response.sessionId];
                }
            }
        }
    }
    public getClients = () => this.clients;

    private onSystemMessage(client: KlaruClient, message: ISystemMessage): void{

    }
    public get ip(): string{
        return this._ip;
    }
    public get port(): number{
        return this._port;
    }

}



