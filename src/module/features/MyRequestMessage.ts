import {MyMessage} from "./MyMessage";
import {KlaruClient} from "./KlaruClient";
import {IInfoMessage} from "./interfaces/IInfoMessage";
import {IRequestMessage} from "./interfaces/IRequestMessage";
import {IMessage} from "./interfaces/IMessage";
import {IResponseMessage} from "./interfaces/IResponseMessage";

export class MyRequestMessage extends MyMessage{
    private readonly requestMessage: IRequestMessage;
    constructor(sender: KlaruClient, message: IRequestMessage) {
        super(sender, message as IInfoMessage);
        this.requestMessage = message;
    }
    public reply(message: string | any): void{
        const content = typeof(message) === "string" ? message : JSON.stringify(message);
        const response: IResponseMessage = {content, responseCode: "OK", sessionId: this.requestMessage.sessionId};
        const string = JSON.stringify(response);
        this.sender.sendPacket({content: string, type: 4});
    }
}