import {ISystemMessage} from "./ISystemMessage";
import {KlaruClient} from "../KlaruClient";
import {MyMessage} from "../MyMessage";
import {KlaruServer} from "../KlaruServer";

export interface IEvents{
    req : [];
    res: [];
    info: [message: MyMessage];
    sys: [message: ISystemMessage];
    connection: [connection: any];
    auth: [client: KlaruClient];
    close: [destination: (KlaruClient | KlaruServer)];
    reconnection: [connection: any]
}