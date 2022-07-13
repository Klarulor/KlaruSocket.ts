"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUniqHash = exports.md5 = void 0;
const crypto_1 = require("crypto");
function md5(data) {
    return (0, crypto_1.createHash)('md5').update(data).digest("hex");
}
exports.md5 = md5;
function createUniqHash(length = 16) {
    const hash = md5(`${Date.now()}:${Math.random()}`);
    return hash.slice(0, length - 1);
}
exports.createUniqHash = createUniqHash;
//# sourceMappingURL=functions.js.map