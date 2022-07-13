"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlaruClient = void 0;
const functions_1 = require("./functions");
const KlaruInteractable_1 = require("./KlaruInteractable");
class KlaruClient extends KlaruInteractable_1.KlaruInteractable {
    constructor(server, con, uid, tag) {
        super();
        this.status = "PREPARING";
        this.authorized = false;
        this.con = con;
        this.uid = uid;
        this.server = server;
    }
    get(keyword, content, maxTTL = 3600) {
        return new Promise(res => {
            const req = { content, sessionId: (0, functions_1.createUniqHash)(), ttl: maxTTL, keyword };
            this.server.createRequest(this, req, res);
        });
    }
}
exports.KlaruClient = KlaruClient;
//# sourceMappingURL=KlaruClient.js.map