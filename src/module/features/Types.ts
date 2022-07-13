export type StateType = 'ALIVE' | "WAITING_FOR_RESPONSE" | "PREPARING" | "LOST" | "RECONNECT" | "CLOSE";
//export type DelegateType = 'req' | "info" | "sys" | "connection" | "auth" | "close";
export type ResponseCode = 'OK' | 'ERROR' | "TIMEOUT" | "BAD_KEY";