import {KlaruInteractable} from "./KlaruInteractable";
import {MyResponseMessage} from "./MyResponseMessage";

export class KlaruServer extends KlaruInteractable{
    req(keyword: string, content: string, maxTTL: number): Promise<MyResponseMessage> {
        return Promise.resolve(undefined);
    }

}