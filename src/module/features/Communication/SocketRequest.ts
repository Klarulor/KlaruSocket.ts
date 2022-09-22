import {SocketSlave} from "../SocketSlave";

export class SocketRequest{
    public readonly sid: string;
    public readonly slave: SocketSlave;

    public constructor(sid: string, slave: SocketSlave) {
        this.sid = sid;
        this.slave = slave;
    }

    public reply(content: string | any): void{

    }
}