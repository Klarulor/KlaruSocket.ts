import {MyMessage} from "./MyMessage";
import {IRequestMessage} from "./interfaces/IRequestMessage";
import {KlaruClient} from "./KlaruClient";
import {IInfoMessage} from "./interfaces/IInfoMessage";
import {IResponseMessage} from "./interfaces/IResponseMessage";
import {KlaruServer} from "./KlaruServer";

export class MyResponseMessage extends MyMessage{
    private readonly responseMessage: IResponseMessage;
    private readonly requestMessage: IRequestMessage;
    constructor(sender: KlaruClient | KlaruServer, message: IResponseMessage, request: IRequestMessage) {
        super(sender, message as IInfoMessage);
        this.responseMessage = message;
        this.requestMessage = request;
    }
}