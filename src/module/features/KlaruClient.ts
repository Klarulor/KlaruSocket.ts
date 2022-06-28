import {StateType} from "./Types";
import {IInfoMessage} from "./interfaces/IInfoMessage";
import {IMessage} from "./interfaces/IMessage";
import {MyResponseMessage} from "./MyResponseMessage";
import {IRequestMessage} from "./interfaces/IRequestMessage";
import {createUniqHash} from "./functions";
import {KlaruSocketServer} from "../KlaruSocketServer";
import {IResponseMessage} from "./interfaces/IResponseMessage";

export class KlaruClient{
    public readonly con: any;
    public readonly uid: string;
    public readonly tag: string;
    public readonly server: KlaruSocketServer;
    public status: StateType = "PREPARING";
    public authorized: boolean = false;
    public loginTime: number;

    constructor(server: KlaruSocketServer, con: any, uid: string, tag: string) {
        this.con = con;
        this.uid = uid;
        this.server = server;
    }


    public sendInfo(message: IInfoMessage | string): void{
        const content = typeof(message) === "string" ? message : (message as IInfoMessage).content;
        this.sendPacket({content, type: 2});
    }
    public req(keyword: string, content: string, maxTTL: number = 5000): Promise<MyResponseMessage>{
        return new Promise<MyResponseMessage>(res => {
            const req: IRequestMessage = {content, sessionId: createUniqHash(), ttl: maxTTL, keyword};
            this.server.createRequest(this, req, res);
        });
    }
    public sendPacket(message: IMessage): void{
        const packet = JSON.stringify(message);
        this.con.sendUTF(packet);
        console.debug(`Sent: ${packet}`)
    }
}