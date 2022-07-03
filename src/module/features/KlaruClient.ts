import {StateType} from "./Types";
import {IInfoMessage} from "./interfaces/IInfoMessage";
import {IMessage} from "./interfaces/IMessage";
import {MyResponseMessage} from "./MyResponseMessage";
import {IRequestMessage} from "./interfaces/IRequestMessage";
import {createUniqHash} from "./functions";
import {KlaruSocketServer} from "../KlaruSocketServer";
import {IResponseMessage} from "./interfaces/IResponseMessage";
import {KlaruInteractable} from "./KlaruInteractable";

export class KlaruClient extends KlaruInteractable{
    public readonly uid: string;
    public readonly tag: string;
    public status: StateType = "PREPARING";
    public authorized: boolean = false;
    public loginTime: number;
    public readonly server: KlaruSocketServer;
    constructor(server: KlaruSocketServer, con: any, uid: string, tag: string) {

        super()

        this.con = con;
        this.uid = uid;
        this.server = server;

    }

    get(keyword: string, content: string, maxTTL: number = 3600): Promise<MyResponseMessage> {
        return new Promise<MyResponseMessage>(res => {
            const req: IRequestMessage = {content, sessionId: createUniqHash(), ttl: maxTTL, keyword};
            this.server.createRequest(this, req, res);
        });
    }



}