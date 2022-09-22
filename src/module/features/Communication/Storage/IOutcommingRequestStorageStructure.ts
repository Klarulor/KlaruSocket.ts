import {ISocketRequestResponse} from "../Native/ISocketRequestResponse";

export interface IOutcommingRequestStorageStructure{
    sid: number;
    promise: Promise<ISocketRequestResponse>;
    promiseContinuer: (res: ISocketRequestResponse) => any;
    timeoutTask: any;
}