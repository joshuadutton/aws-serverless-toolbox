"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVar = void 0;
function getEnvVar(name) {
    var value = process.env[name];
    if (!value) {
        throw new Error(name + " not defined in env");
    }
    return value;
}
exports.getEnvVar = getEnvVar;
//# sourceMappingURL=utilities.js.map