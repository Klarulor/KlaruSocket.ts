"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlaruSocketServer = void 0;
const KlaruClient_1 = require("./features/KlaruClient");
const WebSocketServer = require('websocket').server;
const http = require('http');
const functions_1 = require("./features/functions");
const MyMessage_1 = require("./features/MyMessage");
const MyRequestMessage_1 = require("./features/MyRequestMessage");
const MyResponseMessage_1 = require("./features/MyResponseMessage");
class KlaruSocketServer {
    constructor(serverTag = "server", connectionKey) {
        this.serverTag = "__null";
        this.clients = [];
        this.eventHandlers = {};
        this.commands = {};
        this.outcomingRequests = {}; // Req from server
        this.getClients = () => this.clients;
        this.serverTag = serverTag;
        this.connectionKey = connectionKey;
        this.httpServer = http.createServer((request, response) => {
            //console.log((new Date()) + ' Received request for ' + request.url);
            response.writeHead(404);
            response.end();
        });
    }
    listen(port, ip, callback) {
        this._ip = ip;
        this._port = port;
        if (this.ip != undefined) {
            this.httpServer.listen(this.port, this.ip, callback);
        }
        else
            this.httpServer.listen(this.port, callback);
        this.socket = new WebSocketServer({
            httpServer: this.httpServer,
            autoAcceptConnections: false
        });
        this.socket.on('request', (req) => this.onConnectionRequest(req));
    }
    createRequest(client, message, callback) {
        const timer = setTimeout(() => {
            const resMessage = { content: "__null", sessionId: message.sessionId, responseCode: "TIMEOUT" };
            const lateMessage = new MyResponseMessage_1.MyResponseMessage(client, resMessage, message);
            callback(lateMessage);
            delete this.outcomingRequests[message.sessionId];
        }, message.ttl);
        const privateCallback = (res) => {
            clearTimeout(timer);
            callback(res);
        };
        this.outcomingRequests[message.sessionId] = {
            callback: privateCallback,
            request: message
        };
        const content = JSON.stringify(message);
        const packet = { content, type: 3 };
        client.sendPacket(packet);
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
    onConnectionRequest(request) {
        var _a;
        const connection = request.accept();
        let current = undefined;
        if (((_a = this.eventHandlers["connection"]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            for (let k in this.eventHandlers["connection"])
                this.eventHandlers["connection"][k](connection);
        }
        setTimeout(() => {
            if (!current)
                connection.close();
        }, 1000);
        connection.on('message', (msg) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            const content = msg.utf8Data;
            try {
                const message = JSON.parse(content);
                if (current && current.authorized === true) {
                    this.onMessage(current, message);
                }
                else {
                    if (message.type === 0) {
                        const prepStruct = JSON.parse(message.content);
                        if (!this.connectionKey || (this.connectionKey && this.connectionKey == prepStruct.connectionKey)) {
                            current = new KlaruClient_1.KlaruClient(this, connection, (0, functions_1.createUniqHash)(), prepStruct.tag);
                            current.authorized = true;
                            current.loginTime = Date.now();
                            this.clients.push(current);
                            if (((_b = this.eventHandlers["auth"]) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                                for (let k in this.eventHandlers["auth"])
                                    this.eventHandlers["auth"][k](current);
                            }
                        }
                    }
                }
            }
            catch (exc) {
                console.error(exc);
                if (((_c = this.eventHandlers["close"]) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                    for (let k in this.eventHandlers["close"])
                        this.eventHandlers["close"][k](connection);
                }
                connection.close();
            }
        }));
        connection.on('close', (reasonCode, description) => {
            if (current) {
                console.debug(current.uid);
                delete this.clients[this.clients.indexOf(current)];
            }
        });
    }
    onMessage(client, message) {
        var _a;
        if (message.type == 1) //connection
         {
            this.onSystemMessage(client, JSON.parse(message.content));
            if (((_a = this.eventHandlers["sys"]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                for (let k in this.eventHandlers["sys"])
                    this.eventHandlers["sys"][k](message);
            }
        }
        if (message.type >= 2 && message.type <= 4) {
            // ---------------------------------------------sMESSAGES
            const myMessage = new MyMessage_1.MyMessage(client, message);
            if (message.type == 2) { //system
                for (let k in this.eventHandlers["info"])
                    this.eventHandlers["info"][k](myMessage);
            }
            else if (message.type == 3) { //request
                const req = JSON.parse(message.content);
                if (Object.keys(this.commands).filter(x => x == req.keyword).length > 0) {
                    const requestMessage = new MyRequestMessage_1.MyRequestMessage(client, req);
                    for (let i in this.commands[req.keyword])
                        this.commands[req.keyword][i](requestMessage);
                }
                else {
                    const resMessage = { content: "__null", sessionId: req.sessionId, responseCode: "TIMEOUT" };
                    const packet = { content: JSON.stringify(resMessage), type: 4 };
                    client.sendPacket(packet);
                }
            }
            else if (message.type == 4) { //response
                const response = JSON.parse(message.content);
                let found = false;
                for (let k in Object.keys(this.outcomingRequests))
                    if (response.sessionId === Object.keys(this.outcomingRequests)[k])
                        found = true;
                //console.log("Found: ", found, response.sessionId, Object.keys(this.outcomingRequests))
                if (found) {
                    const res = new MyResponseMessage_1.MyResponseMessage(client, response, this.outcomingRequests[response.sessionId].request);
                    this.outcomingRequests[response.sessionId].callback(res);
                    delete this.outcomingRequests[response.sessionId];
                }
            }
        }
    }
    onSystemMessage(client, message) {
    }
    get ip() {
        return this._ip;
    }
    get port() {
        return this._port;
    }
}
exports.KlaruSocketServer = KlaruSocketServer;
//# sourceMappingURL=KlaruSocketServer.js.map