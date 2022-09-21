import { SocketConnection } from "./features/SocketConnection";
import { WebSocketConnection } from "./features/Types";

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

export class KlaruSocketServer{
    private readonly _serverTag?: string;

    private _hostIP: string;
    private _hostPort: number;

    private _httpServer: any;
    private _soketServer: any;

    private _connectionKeys: string[] | string;

    private _connections: {[id: string]: SocketConnection};

    constructor(serverTag?: string){
        this._serverTag = serverTag;
    }
    public listen(port: number, ip: string = "127.0.0.1", connectionKeys?: string[] | string,callback?: (() => any)): void{
        this._hostIP = ip;
        this._hostPort = port;

        this._httpServer = http.createServer((request: any, response: { writeHead: (arg0: number) => void; end: () => void; }) => {
            response.writeHead(404);
            response.end();
        });

        this._httpServer.listen(this._hostPort, this._hostIP, callback);
        this._soketServer = new WebSocketServer({
            httpServer: this._httpServer,
            autoAcceptConnections: false
        });

        this._connectionKeys = typeof(connectionKeys) == "object" ? this._connectionKeys : typeof(connectionKeys) == "string" ? [connectionKeys] : null;

        this._soketServer.on('request', (req: any) => {
            const headers: string[] = req.httpRequest.rawHeaders;
            if(headers.length > 128) return req.reject(406, "Headers is too much");
            // connection key finding;
            if(this._connectionKeys){
                let foundConnectionKey: string;
                for(let i = 0; i < headers.length; i++){
                    if(headers[i] == "connectionKey" && i+1 < headers.length){
                        foundConnectionKey = headers[i+1];
                    }
                }

                if(!((typeof(this._connectionKeys) == "string" && this._connectionKeys == foundConnectionKey) || this._connectionKeys.includes(foundConnectionKey)))
                    req.reject(403, "Bad connection key");
            }

            const connection = req.accept();
            this.createConnection(connection);
        });
    }
    private createConnection(connection: WebSocketConnection): void{
        
    }
}