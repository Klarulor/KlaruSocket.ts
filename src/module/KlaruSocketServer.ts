import { SocketSlave } from "./features/SocketSlave";
import { WebSocketConnection } from "./features/Types";
import {
    concatConnectionTag,
    convertArrayToObject,
    convertToBytes, createString,
    IConvertToBytesContentOptions
} from "./features/functions";
import {
    ITagConnectionMessageStructure
} from "./features/Communication/MessageStructures/ITagConnectionMessageStructure";
import {endianness} from "os";
import {SocketCommunicationMessageType} from "./features/Enums";
import {NetworkPacketManager} from "./features/NetworkPacketManager";
import {IKlaruSocket} from "./features/interfaces/IKlaruSocket";
const WebSocketServer = require('websocket').server;
const http = require('http');

// this.httpServer = http.createServer((request: any, response: { writeHead: (arg0: number) => void; end: () => void; }) => {
//     //console.log((new Date()) + ' Received request for ' + request.url);
//     response.writeHead(404);
//     response.end();
// });


// this.httpServer.listen(this.port, callback);
// this.socket = new WebSocketServer({
//     httpServer: this.httpServer,
//     autoAcceptConnections: false
// });

// this.socket.on('request', (req: any) => this.onConnectionRequest(req));

// request.accept();

export class KlaruSocketServer implements IKlaruSocket{
    private readonly _serverTag?: string;

    private _hostIP: string;
    private _hostPort: number;

    private _httpServer: any;
    private _socketServer: any;

    private _connectionKey: string;
    private _options: IKlaruSocketServerListenOptions;

    private readonly _connections: {[id: string]: SocketSlave} = {};

    public readonly network: NetworkPacketManager = new NetworkPacketManager(this);

    constructor(serverTag?: string){
        this._serverTag = serverTag;
    }
    public listen(port: number, ip: string = "127.0.0.1", callback?: (() => any), opts: IKlaruSocketServerListenOptions =
        {
            connectionKey: null,
            allowSameTag: false,
            mergeOptions: {
                ack: false
            }
        }): void{
        this._hostIP = ip;
        this._hostPort = port;

        //@ts-ignore
        this._httpServer = http.createServer((request: any, response: { writeHead: (arg0: number) => void; end: () => void; }) => {
            response.writeHead(404);
            response.end();
        });

        this._httpServer.listen(this._hostPort, this._hostIP, callback);
        this._socketServer = new WebSocketServer({
            httpServer: this._httpServer,
            autoAcceptConnections: false
        });

        this._connectionKey = opts.connectionKey;
        this._options = opts;

        console.log(this._options.allowSameTag);

        this._socketServer.on('request', this.onSocketRequest.bind(this));
        this._socketServer.on(`message`, this.onMessage.bind(this));
    }

    private onSocketRequest(req: any): void{
        console.log('a1')
        /*try{*/
            const rawHeaders: string[] = req.httpRequest.rawHeaders;
            if(rawHeaders.length > 128) return req.reject(406, "Headers is too much");
            const headers = convertArrayToObject(rawHeaders);
            console.log('a2')
            if(this._connectionKey){
                console.log('a3')
                let connectionKey: string = headers.connectionKey;
                if(!connectionKey)
                    return req.reject(403, "Bad connection key");

                if(this._connectionKey != connectionKey)
                    return req.reject(403, "Bad connection key");
            }
            const tagSource = headers.tag ?? "{\"tag\":\"da\",\"hash\": \"pizda\"}";
            console.log('a4')
            if(!tagSource)
                return req.reject(403, "Bad tag source");
            console.log('a5')
            const tag = JSON.parse(tagSource) as ITagConnectionMessageStructure;
            console.log(this._connections)
            const cons = Object.values(this._connections).filter(x => x.state === "LOST" && x.tag.tag === tag.tag && x.tag.hash === tag.hash);
            console.log('a6')
            /*if(cons.length > 0){
                console.log('a7')
                const connection = req.accept();
                this.replaceConnection(connection, cons[0]);
            }else{
                console.log('a8')
                const sameTagCons = Object.values(this._connections).filter(x => x.tag.tag === tag.tag);
                if(!this._options.allowSameTag && sameTagCons.length > 0)
                    return req.reject(403, "Same client already connected with the same tag");
                const connection = req.accept();
                this.createConnection(connection, tag);
                console.log("creating connection")
            }*/

            if(cons.length === 0){
                const sameTagCons = Object.values(this._connections).filter(x => x.tag.tag === tag.tag);
                if(!this._options.allowSameTag && sameTagCons.length > 0)
                    return req.reject(403, "Same client already connected with the same tag");
            }
            const connection = req.accept();
            if(cons.length === 0)
                this.createConnection(connection, tag);
            else
                this.replaceConnection(connection, cons[0]);
            this.initConnection(connection, tag);

        /*}catch (e) {
            console.log(`Something got wrong with handling new connection: ${e}`)
        }*/
    }
    private initConnection(connection: WebSocketConnection, tag: ITagConnectionMessageStructure): void{
        connection.on(`message`, (message: any) => this.onMessage(connection, tag, message));
    }
    private createConnection(connection: WebSocketConnection, tag: ITagConnectionMessageStructure): void{
        const slave = new SocketSlave(this, connection, tag);
        this._connections[concatConnectionTag(tag)] = slave;
    }
    private replaceConnection(connection: WebSocketConnection, client: SocketSlave): void{
        client.updateConnection(connection, "CONNECTED");
    }


    private onMessage(connection: WebSocketConnection, tag: ITagConnectionMessageStructure, struct: any): void{
        if(struct.type === "binary"){
            console.log(`Produce new packet: ${struct.buffer}`);
            const sender = this._connections[concatConnectionTag(tag)];
            this.network.receivePacket(sender, struct.buffer);
        }
    }

    /*public sendPacket(slave: SocketSlave, opts: IKlaruSocketServerSendPacketOptions): void{
        const bytes = convertToBytes(opts.messageType, opts.flags, opts.cargo, opts.flags);
        const buffer = Buffer.alloc(bytes.length, Buffer.from(new Uint8Array(bytes)));

        slave.sendBuffer(buffer);

    }*/

    public readonly uid = createString(32);

    sendBuffer(target: SocketSlave | null, buffer: Buffer): void {
        target.sendBuffer(buffer);
    }
}


export interface IKlaruSocketServerListenOptions{
    connectionKey: string;
    allowSameTag: boolean;
    mergeOptions: IKlaruSocketServerListenMergeOptions;
}

export interface IKlaruSocketServerListenMergeOptions{
    ack: boolean
}

export interface IKlaruSocketServerSendPacketOptions{
    messageType: SocketCommunicationMessageType;
    flags: number;
    cargo?: (IConvertToBytesContentOptions | string | Buffer | null), sid?: number;
}