"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlaruSocketClient = void 0;
let WebSocketClient = require('websocket').w3cwebsocket;
const functions_1 = require("./features/functions");
const MyMessage_1 = require("./features/MyMessage");
const MyRequestMessage_1 = require("./features/MyRequestMessage");
const MyResponseMessage_1 = require("./features/MyResponseMessage");
const KlaruServer_1 = require("./features/KlaruServer");
class KlaruSocketClient {
    constructor(clientTag) {
        this.tag = "__null";
        this.eventHandlers = {};
        this.commands = {};
        this.outcomingRequests = {}; // Req from serve
        this.tag = clientTag;
    }
    on(event, callback) {
        if (!this.eventHandlers[event])
            this.eventHandlers[event] = [];
        this.eventHandlers[event].push(callback);
    }
    off(event, callback) {
        delete this.eventHandlers[event][this.eventHandlers[event].indexOf(callback)];
    }
    subscribe(key, callback) {
        if (!this.commands[key])
            this.commands[key] = [];
        this.commands[key].push(callback);
    }
    connect(port, ip = "127.0.0.1", connectionKey) {
        const string = `ws://${ip}:${port}`;
        this.client = new WebSocketClient(string);
        this.client.connect(`ws://${ip}:${port}`);
        this.client.onopen = (connection) => {
            var _a;
            this.connection = connection;
            this.connectionTime = Date.now();
            this.state = "PREPARING";
            this.klaruServer = new KlaruServer_1.KlaruServer();
            this.klaruServer.con = this.connection;
            if (((_a = this.eventHandlers["connection"]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                for (let k in this.eventHandlers["connection"])
                    this.eventHandlers["connection"][k](connection);
            }
            //Auth
            const authPacket = { connectionKey, tag: this.tag };
            setTimeout(() => {
                connection.sendUTF(JSON.stringify({ content: JSON.stringify(authPacket), type: 0 }));
                //console.log("auth")
            }, 250);
            setTimeout(() => {
                var _a;
                if (this.state != "CLOSE" && ((_a = this.eventHandlers["auth"]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    for (let k in this.eventHandlers["auth"])
                        this.eventHandlers["auth"][k]();
                }
            }, 500);
            connection.onclose = () => {
                this.state = "CLOSE";
                //console.log("Close")
            };
            connection.onmessage = (content) => {
                const message = JSON.parse(content.utf8Data);
                this.onMessage(message);
            };
        };
    }
    sendPacket(message) {
        this.connection.sendUTF(JSON.stringify(message));
    }
    get(keyword, content) {
        return new Promise(res => {
            const message = { content: JSON.stringify(content), sessionId: (0, functions_1.createUniqHash)(), ttl: 3600, keyword };
            const timer = setTimeout(() => {
                const resMessage = { content: "__null", sessionId: message.sessionId, responseCode: "TIMEOUT" };
                const lateMessage = new MyResponseMessage_1.MyResponseMessage(this.klaruServer, resMessage, message);
                res(lateMessage);
                delete this.outcomingRequests[message.sessionId];
            }, 3600);
            const privateCallback = (r) => {
                clearTimeout(timer);
                res(r);
            };
            this.outcomingRequests[message.sessionId] = {
                callback: privateCallback,
                request: message
            };
            const cc = JSON.stringify(message);
            const packet = { content: cc, type: 3 };
            this.klaruServer.sendPacket(packet);
        });
    }
    onMessage(message) {
        var _a;
        if (message.type == 1) //connection
         {
            if (((_a = this.eventHandlers["sys"]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                for (let k in this.eventHandlers["sys"])
                    this.eventHandlers["sys"][k](message);
            }
        }
        if (message.type >= 2 && message.type <= 4) {
            // ---------------------------------------------sMESSAGES
            const myMessage = new MyMessage_1.MyMessage(this.klaruServer, message);
            if (message.type == 2) { //system
                for (let k in this.eventHandlers["info"])
                    this.eventHandlers["info"][k](myMessage);
            }
            else if (message.type == 3) { //request
                const req = JSON.parse(message.content);
                if (Object.keys(this.commands).filter(x => x == req.keyword).length > 0) {
                    const requestMessage = new MyRequestMessage_1.MyRequestMessage(this.klaruServer, req);
                    for (let i in this.commands[req.keyword])
                        this.commands[req.keyword][i](requestMessage);
                }
                else {
                    const resMessage = { content: "__null", sessionId: req.sessionId, responseCode: "TIMEOUT" };
                    const packet = { content: JSON.stringify(resMessage), type: 4 };
                    this.klaruServer.sendPacket(packet);
                }
            }
            else if (message.type == 4) { //response
                const response = JSON.parse(message.content);
                let found = false;
                for (let k in Object.keys(this.outcomingRequests))
                    if (response.sessionId == Object.keys(this.outcomingRequests)[k])
                        found = true;
                if (found) {
                    const res = new MyResponseMessage_1.MyResponseMessage(this.klaruServer, response, this.outcomingRequests[response.sessionId].request);
                    this.outcomingRequests[response.sessionId].callback(res);
                    delete this.outcomingRequests[response.sessionId];
                }
            }
        }
    }
}
exports.KlaruSocketClient = KlaruSocketClient;
//# sourceMappingURL=KlaruSocketClient.js.map