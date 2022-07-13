"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlaruInteractable = void 0;
class KlaruInteractable {
    sendInfo(message) {
        const content = typeof (message) === "string" ? message : message.content;
        this.sendPacket({ content, type: 2 });
    }
    sendPacket(message) {
        const packet = JSON.stringify(message);
        this.con.sendUTF(packet);
        console.debug(`Sent: ${packet}`);
    }
}
exports.KlaruInteractable = KlaruInteractable;
//# sourceMappingURL=KlaruInteractable.js.map