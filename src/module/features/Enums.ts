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
}

export enum SocketProviderDeliveryContentEncodingFlags{
    ISB = 1 << 0,  // 1  Is buffer
    OBY = 1 << 1, // 2  Encoding by 1 byte with <>.chatCodeAt()
    TBY = 1 << 2, // 4  Encoding by 2 byte with <>.chatCodeAt()
}

export enum SocketResponseError{
    NONE                                = 0,
    CLIENT_NOTFOUND_HANDLER             = 1 << 0, // 1
    CLIENT_HANDLER_NOT_RESPONDING       = 1 << 1, // 2
    CLIENT_NOT_RESPONDING               = 1 << 2, // 4
}