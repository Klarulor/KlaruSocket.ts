import { IInfoMessage } from "./IInfoMessage";
import { ResponseCode } from "../Types";
export interface IResponseMessage extends IInfoMessage {
    sessionId: string;
    responseCode: ResponseCode;
}
