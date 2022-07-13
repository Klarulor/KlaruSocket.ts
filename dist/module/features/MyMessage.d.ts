import { IInfoMessage } from "./interfaces/IInfoMessage";
import { KlaruClient } from "./KlaruClient";
import { KlaruServer } from "./KlaruServer";
export declare class MyMessage {
    readonly content: string;
    readonly data: any;
    sender: KlaruClient | KlaruServer;
    constructor(sender: KlaruClient | KlaruServer, message: IInfoMessage);
}
