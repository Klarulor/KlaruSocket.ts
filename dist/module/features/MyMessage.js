"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyMessage = void 0;
class MyMessage {
    constructor(sender, message) {
        this.sender = sender;
        this.content = message.content;
        try {
            this.data = JSON.parse(message.content);
        }
        catch (_a) { }
    }
}
exports.MyMessage = MyMessage;
//# sourceMappingURL=MyMessage.js.map