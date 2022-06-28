import {IInfoMessage} from "./interfaces/IInfoMessage";
import {KlaruClient} from "./KlaruClient";

export class MyMessage{
    public readonly content: string;
    public readonly data: any;
    public sender: KlaruClient;

    constructor(sender: KlaruClient, message: IInfoMessage) {
        this.sender = sender;
        this.content = message.content;
        try{
            this.data = JSON.parse(message.content);
        }catch {}
    }

}