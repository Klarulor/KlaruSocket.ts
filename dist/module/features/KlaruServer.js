"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlaruServer = void 0;
const KlaruInteractable_1 = require("./KlaruInteractable");
class KlaruServer extends KlaruInteractable_1.KlaruInteractable {
    get(keyword, content, maxTTL) {
        return new Promise(res => {
            throw "IT DONT WORK";
        });
    }
}
exports.KlaruServer = KlaruServer;
//# sourceMappingURL=KlaruServer.js.map