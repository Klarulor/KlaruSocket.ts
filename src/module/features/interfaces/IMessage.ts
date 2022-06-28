export interface IMessage{
    content: string;
    type: number;
}

/*
Types of message
0 - IPreparingMessage
1 - ISystemMessage
2 - IInfoMessage
3 - IRequestMessage
4 - IResponseMessage
 */