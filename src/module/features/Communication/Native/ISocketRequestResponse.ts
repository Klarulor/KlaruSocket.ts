import {SocketResponseError} from "../../Enums";

export interface ISocketRequestResponse{
    success: boolean;
    error: SocketResponseError;
    sourceContent: string;
    data: any; // Can be an object with fields when sourceContent field is json or array
}