import { StateType } from "./Types";
import { MyResponseMessage } from "./MyResponseMessage";
import { KlaruSocketServer } from "../KlaruSocketServer";
import { KlaruInteractable } from "./KlaruInteractable";
export declare class KlaruClient extends KlaruInteractable {
    readonly uid: string;
    readonly tag: string;
    status: StateType;
    authorized: boolean;
    loginTime: number;
    readonly server: KlaruSocketServer;
    constructor(server: KlaruSocketServer, con: any, uid: string, tag: string);
    get(keyword: string, content: string, maxTTL?: number): Promise<MyResponseMessage>;
}
