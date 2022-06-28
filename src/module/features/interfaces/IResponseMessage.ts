import {IInfoMessage} from "./IInfoMessage";
import {ResponseCode} from "../Types";

export interface IResponseMessage extends IInfoMessage{
    sessionId: string; // SessionId field is field from request message
    responseCode: ResponseCode;
}