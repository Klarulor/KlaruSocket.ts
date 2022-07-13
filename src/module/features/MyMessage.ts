import {IInfoMessage} from "./interfaces/IInfoMessage";
import {KlaruClient} from "./KlaruClient";
import {KlaruServer} from "./KlaruServer";

export class MyMessage{
    public readonly content: string;
    public readonly data: any;
    public sender: KlaruClient | KlaruServer;

    constructor(sender: KlaruClient | KlaruServer, message: IInfoMessage) {
        this.sender = sender;
        this.content = message.content;
        try{
            this.data = JSON.parse(message.content);
        }catch {}
    }

}