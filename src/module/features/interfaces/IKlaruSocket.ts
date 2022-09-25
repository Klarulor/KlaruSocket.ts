import * as Buffer from "buffer";
import {SocketSlave} from "../SocketSlave";

export interface IKlaruSocket{
    uid: string;
    sendBuffer: (target: SocketSlave | null, buffer: Buffer) => void;
}