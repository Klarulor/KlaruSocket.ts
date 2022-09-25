import {SocketSlave} from "./SocketSlave";
import {convertIncomeBuffer, convertToBytes, createSYNSid} from "./functions";
import {IKlaruSocketServerSendPacketOptions} from "../KlaruSocketServer";
import {SocketCommunicationMessageType, SocketDeliveryFlags} from "./Enums";
import {IKlaruSocket} from "./interfaces/IKlaruSocket";
import {KlaruSocketSender} from "./Types";
import {IKlaruSocketInteractable} from "./interfaces/IKlaruSocketInteractable";

export class NetworkPacketManager{
    private readonly outcomeSYNBuffer: {[ssid: number]: {socket: IKlaruSocketInteractable, opts: IKlaruSocketServerSendPacketOptions, timestamp: number}} = {};;
    private readonly socket: IKlaruSocket;
    constructor(socket: IKlaruSocket) {
        this.socket = socket;
    }

    public sendPacket(target: IKlaruSocketInteractable, opts: IKlaruSocketServerSendPacketOptions): void{

        let bytes: number[] = [];
        if(opts.flags & SocketDeliveryFlags.SYN){
            const synSid = createSYNSid();
            bytes = convertToBytes(opts.messageType, opts.flags, opts.cargo, {synSid});

            this.outcomeSYNBuffer[synSid] = {
                socket: target, opts,
                timestamp: Date.now()
            };

        }else
            bytes = convertToBytes(opts.messageType, opts.flags, opts.cargo);
        const buffer = Buffer.alloc(bytes.length, Buffer.from(new Uint8Array(bytes)));



        this.socket.sendBuffer(target, buffer);
    }


    public receivePacket(sender: IKlaruSocketInteractable, buffer: Buffer): void{
        const data = convertIncomeBuffer(buffer);
        if(data.type == SocketCommunicationMessageType.SYS && data.sysFlags.includes(SocketDeliveryFlags.ACK)){
            const ssid = data.synSid;
            if(this.outcomeSYNBuffer[ssid])
                delete this.outcomeSYNBuffer[ssid];
        }

        if(data.sysFlags.includes(SocketDeliveryFlags.SYN))
        {
            this.sendPacket(sender, {
                    messageType: SocketCommunicationMessageType.SYS,
                    cargo: null,
                    flags: SocketDeliveryFlags.ACK
                }
            );!!!!!
        }
    }}