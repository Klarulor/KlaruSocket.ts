import { MyMessage } from "./MyMessage";
import { IRequestMessage } from "./interfaces/IRequestMessage";
import { KlaruClient } from "./KlaruClient";
import { IResponseMessage } from "./interfaces/IResponseMessage";
import { KlaruServer } from "./KlaruServer";
export declare class MyResponseMessage extends MyMessage {
    private readonly responseMessage;
    private readonly requestMessage;
    constructor(sender: KlaruClient | KlaruServer, message: IResponseMessage, request: IRequestMessage);
}
