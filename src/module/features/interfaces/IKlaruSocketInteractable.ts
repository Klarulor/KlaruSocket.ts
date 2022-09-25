import {SocketSlave} from "../SocketSlave";

export interface IKlaruSocketInteractable{
    sendBuffer: (target: SocketSlave | null, buffer: Buffer) => void;
}