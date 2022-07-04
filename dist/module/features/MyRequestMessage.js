"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRequestMessage = void 0;
const MyMessage_1 = require("./MyMessage");
class MyRequestMessage extends MyMessage_1.MyMessage {
    constructor(sender, message) {
        super(sender, message);
        this.requestMessage = message;
    }
    reply(message) {
        const content = typeof (message) === "string" ? message : JSON.stringify(message);
        const response = { content, responseCode: "OK", sessionId: this.requestMessage.sessionId };
        const string = JSON.stringify(response);
        this.sender.sendPacket({ content: string, type: 4 });
    }
}
exports.MyRequestMessage = MyRequestMessage;
//# sourceMappingURL=MyRequestMessage.js.map