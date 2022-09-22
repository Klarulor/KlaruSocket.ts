export enum SocketCommunicationMessageType{
    NONE = 0,
    SYS = 1,
    SEND = 2,
    REQ = 3,
    RES = 4
}

export enum SocketCommunicationFlags{
    ACK = 1 << 0, // 1
    SYN = 1 << 1, // 2
    FIN = 1 << 2, // 4
}

export enum SocketProviderDeliveryFlags{
    CNT = 1 << 0,  // 1  Packet has a content
    SID = 1 << 1,  // 2  Packet has a sid
    CIB = 1 << 2,  // 4  Content is string
}

export enum SocketResponseError{
    NONE                                = 0,
    CLIENT_NOTFOUND_HANDLER             = 1 << 0, // 1
    CLIENT_HANDLER_NOT_RESPONDING       = 1 << 1, // 2
    CLIENT_NOT_RESPONDING               = 1 << 2, // 4
}