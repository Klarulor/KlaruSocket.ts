import { KlaruInteractable } from "./KlaruInteractable";
import { MyResponseMessage } from "./MyResponseMessage";
export declare class KlaruServer extends KlaruInteractable {
    get(keyword: string, content: string, maxTTL: number): Promise<MyResponseMessage>;
}
