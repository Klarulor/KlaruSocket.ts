import { MyMessage } from "./MyMessage";
import { KlaruClient } from "./KlaruClient";
import { IRequestMessage } from "./interfaces/IRequestMessage";
import { KlaruServer } from "./KlaruServer";
export declare class MyRequestMessage extends MyMessage {
    private readonly requestMessage;
    constructor(sender: KlaruClient | KlaruServer, message: IRequestMessage);
    reply(message: string | any): void;
}
