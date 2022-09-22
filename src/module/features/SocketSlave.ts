import {SocketConnectionState, WebSocketConnection} from "./Types";
import {ITagConnectionMessageStructure} from "./Communication/MessageStructures/ITagConnectionMessageStructure";
import {SocketRequest} from "./Communication/SocketRequest";
import {IIncomingRequestStorageStructure} from "./Communication/Storage/IIncomingRequestStorageStructure";
import {IOutcommingRequestStorageStructure} from "./Communication/Storage/IOutcommingRequestStorageStructure";
import {createSid} from "./functions";
import {ISocketRequestResponse} from "./Communication/Native/ISocketRequestResponse";
import {SocketResponseError} from "./Enums";

export class SocketSlave {
    private _connection: WebSocketConnection;
    public readonly tag: ITagConnectionMessageStructure;
    private readonly _incomingRequests: {[sid: string]: IIncomingRequestStorageStructure}
    private readonly _outcommingRequests: {[sid: string]: IOutcommingRequestStorageStructure}


    private _state: SocketConnectionState;

    public constructor(connection: WebSocketConnection, tag: ITagConnectionMessageStructure) {
        this._connection = connection;
        this.tag = tag;
    }

    public get state(){return this._state};
    public get connection(){return this._connection};

    public send(key: string, body: any | string): void{

    }

    public get(key: string, body: any | string, opts: ISocketSlaveGetOptions = {ack: false, maxTTL: 3000, additionalTTL: 1000}): Promise<ISocketRequestResponse>{
        const promise = new Promise<ISocketRequestResponse>(res => {
            const sid = createSid();
            const task = setTimeout(() => {
                const preRes: ISocketRequestResponse = {
                    sourceContent: "",
                    success: false,
                    error: SocketResponseError.CLIENT_NOT_RESPONDING,
                    data: null
                };
                res(preRes);
                delete this._outcommingRequests[sid];
            }, opts.maxTTL + opts.additionalTTL);
            const storageStruct: IOutcommingRequestStorageStructure = {
                promise, sid, promiseContinuer: res, timeoutTask: task
            };
            this._outcommingRequests[sid] = storageStruct;
        })
        return promise;
    }

    public subscribeOnce(key: string, handler: (req: SocketRequest) => any): void{

    }

    public updateConnection(newConnection: WebSocketConnection, newState: SocketConnectionState): void{
        this._connection = newConnection;
        this._state = newState;
    }
}


export interface ISocketSlaveGetOptions{
    ack: boolean; // be sure that message wiil be sent and return
    maxTTL: number;
    additionalTTL: number;
}