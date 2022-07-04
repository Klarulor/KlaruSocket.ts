"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyResponseMessage = void 0;
const MyMessage_1 = require("./MyMessage");
class MyResponseMessage extends MyMessage_1.MyMessage {
    constructor(sender, message, request) {
        super(sender, message);
        this.responseMessage = message;
        this.requestMessage = request;
    }
}
exports.MyResponseMessage = MyResponseMessage;
//# sourceMappingURL=MyResponseMessage.js.map