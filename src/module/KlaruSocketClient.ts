const WebSocketClient = require('websocket').client;

export class KlaruSocketClient{
    private readonly _clientTag: string;
    public autoReconnect: boolean = true;

    private _hostIP: string;
    private _hostPort: number;

    private readonly _connector = new WebSocketClient();

    constructor(clientTag: string){
        this._clientTag = clientTag;
    }

    public connect(port: number, ip: string, connectionKey?: string, callback?: () => any): void{
        this._hostIP = ip;
        this._hostPort = port;

        this._connector.connect(`ws://${ip}:${port}`, undefined, undefined, {
            "connectionKey": connectionKey
        });
        this._connector.on('connect', (connection: any) => {
            if(callback) 
                callback();
        });
    }
}