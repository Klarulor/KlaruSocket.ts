import {IInfoMessage} from "./interfaces/IInfoMessage";
import {MyResponseMessage} from "./MyResponseMessage";
import {IRequestMessage} from "./interfaces/IRequestMessage";
import {createUniqHash} from "./functions";
import {IMessage} from "./interfaces/IMessage";

export abstract class KlaruInteractable{
    public con: any;



    public sendInfo(message: IInfoMessage | string): void{
        const content = typeof(message) === "string" ? message : (message as IInfoMessage).content;
        this.sendPacket({content, type: 2});
    }
    public abstract get(keyword: string, content: string, maxTTL: number): Promise<MyResponseMessage>;
    public sendPacket(message: IMessage): void{
        const packet = JSON.stringify(message);
        this.con.sendUTF(packet);
        console.debug(`Sent: ${packet}`)
    }
}