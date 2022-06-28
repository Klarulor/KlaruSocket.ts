import {ISystemMessage} from "./ISystemMessage";
import {KlaruClient} from "../KlaruClient";
import {MyMessage} from "../MyMessage";

export interface IEvents{
    req : [];
    res: [];
    info: [message: MyMessage];
    sys: [message: ISystemMessage];
    connection: [connection: any];
    auth: [client: KlaruClient];
    close: [connection: any];
}