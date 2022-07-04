import { IInfoMessage } from "./interfaces/IInfoMessage";
import { MyResponseMessage } from "./MyResponseMessage";
import { IMessage } from "./interfaces/IMessage";
export declare abstract class KlaruInteractable {
    con: any;
    sendInfo(message: IInfoMessage | string): void;
    abstract get(keyword: string, content: string, maxTTL: number): Promise<MyResponseMessage>;
    sendPacket(message: IMessage): void;
}
