import {IInfoMessage} from "./IInfoMessage";

export interface IRequestMessage extends IInfoMessage{
    keyword: string;
    sessionId: string;
    ttl: number;
}