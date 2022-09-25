import {ISocketRequestResponse} from "../Native/ISocketRequestResponse";

export interface IOutcommingRequestStorageStructure{
    sid: number;
    promiseContinuer: (res: ISocketRequestResponse) => any;
    timeoutTask: any;
}