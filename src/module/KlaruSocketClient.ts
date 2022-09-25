import {WebSocketConnection} from "./features/Types";
import {IKlaruSocket} from "./features/interfaces/IKlaruSocket";
import {createString} from "./features/functions";
import {SocketSlave} from "./features/SocketSlave";
import {NetworkPacketManager} from "./features/NetworkPacketManager";
import {IKlaruSocketInteractable} from "./features/interfaces/IKlaruSocketInteractable";

const WebSocketClient = require('websocket').client;

export class KlaruSocketClient implements IKlaruSocket, IKlaruSocketInteractable{
    private readonly _clientTag: string;
    public autoReconnect: boolean = true;

    private _hostIP: string;
    private _hostPort: number;

    private readonly _connector = new WebSocketClient();
    private  _connection: WebSocketConnection;

    public readonly network: NetworkPacketManager = new NetworkPacketManager(this);

    public get connection(){return this._connection}

    constructor(clientTag: string){
        this._clientTag = clientTag;
    }

    public connect(port: number, ip: string, connectionKey?: string, callback?: () => any): void{
        this._hostIP = ip;
        this._hostPort = port;

        this._connector.connect(`ws://${ip}:${port}`, undefined, {
            "connectionKey": connectionKey
        });
        this._connector.on('connect', (connection: any) => {
            this._connection = connection;
            if(callback) 
                callback();
        });
    }

    public readonly uid = createString(32);

    sendBuffer(target: SocketSlave | null, buffer: Buffer): void {
    }
}