import {SocketConnectionState, WebSocketConnection} from "./Types";
import {ITagConnectionMessageStructure} from "./Communication/MessageStructures/ITagConnectionMessageStructure";
import {SocketRequest} from "./Communication/SocketRequest";
import {IIncomingRequestStorageStructure} from "./Communication/Storage/IIncomingRequestStorageStructure";
import {IOutcommingRequestStorageStructure} from "./Communication/Storage/IOutcommingRequestStorageStructure";
import {bitEnumToNum, convertToBytes, createSid, IConvertToBytesContentOptions} from "./functions";
import {ISocketRequestResponse} from "./Communication/Native/ISocketRequestResponse";
import {
    SocketDeliveryFlags,
    SocketCommunicationMessageType,
    SocketProviderDeliveryContentEncodingFlags,
    SocketResponseError
} from "./Enums";
import {IKlaruSocketServerSendPacketOptions, KlaruSocketServer} from "../KlaruSocketServer";
import {NetworkPacketManager} from "./NetworkPacketManager";
import {KlaruSocketClient} from "../KlaruSocketClient";
import {IKlaruSocketInteractable} from "./interfaces/IKlaruSocketInteractable";

export class SocketSlave implements IKlaruSocketInteractable{
    private _connection: WebSocketConnection;
    public readonly tag: ITagConnectionMessageStructure;
    private readonly _incomingRequests: {[sid: string]: IIncomingRequestStorageStructure}
    private readonly _outcommingRequests: {[sid: string]: IOutcommingRequestStorageStructure}
    public readonly socketServer: KlaruSocketServer;

    private _state: SocketConnectionState;

    public constructor(server: KlaruSocketServer, connection: WebSocketConnection, tag: ITagConnectionMessageStructure) {
        this.socketServer = server;
        this._connection = connection;
        this.tag = tag;
    }

    public get state(){return this._state};
    public get connection(){return this._connection};

    public send(key: string, body: any | string): void{

    }

    public get(key: string, body: any | string, opts: ISocketSlaveGetOptions = {ack: false, maxTTL: 3000, additionalTTL: 1000}): Promise<ISocketRequestResponse>{
        return new Promise<ISocketRequestResponse>(res => {
            const sid = createSid();
            const task = setTimeout(() => {
                const preRes: ISocketRequestResponse = {
                    sourceContent: "",
                    success: false,
                    error: SocketResponseError.CLIENT_NOT_RESPONDING,
                    data: null
                };
                delete this._outcommingRequests[sid];
                res(preRes);
            }, opts.maxTTL + opts.additionalTTL);

            const storageStruct: IOutcommingRequestStorageStructure = {
                sid, promiseContinuer: res, timeoutTask: task
            };

            this._outcommingRequests[sid] = storageStruct;


            const content = typeof(body) === "string" ? body : JSON.stringify(body);
            const flags: number = bitEnumToNum((opts.ack ? [SocketDeliveryFlags.ACK] : []) as SocketDeliveryFlags[]);
            const packetOpts: IKlaruSocketServerSendPacketOptions = {
                sid,
                flags,
                messageType: SocketCommunicationMessageType.REQ,
                cargo: {
                    content,
                    flags: [SocketProviderDeliveryContentEncodingFlags.TBY]
                }
            }
            this.sendPacket(packetOpts);
        })
    }

    public subscribeOnce(key: string, handler: (req: SocketRequest) => any): void{

    }

    public updateConnection(newConnection: WebSocketConnection, newState: SocketConnectionState): void{
        this._connection = newConnection;
        this._state = newState;
    }

    public sendPacket = (opts: IKlaruSocketServerSendPacketOptions) => this.socketServer.network.sendPacket(this, opts);

    public sendBuffer = (buffer: Buffer) => this.connection.sendBytes(buffer);
}


export interface ISocketSlaveGetOptions{
    ack: boolean; // be sure that message wiil be sent and return
    maxTTL: number;
    additionalTTL: number;
}