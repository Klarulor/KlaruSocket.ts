import {KlaruInteractable} from "./KlaruInteractable";
import {MyResponseMessage} from "./MyResponseMessage";
import {IRequestMessage} from "./interfaces/IRequestMessage";
import {createUniqHash} from "./functions";

export class KlaruServer extends KlaruInteractable{
    get(keyword: string, content: string, maxTTL: number): Promise<MyResponseMessage> {
        return new Promise<MyResponseMessage>(res => {
            throw "IT DONT WORK";
        });
    }

}