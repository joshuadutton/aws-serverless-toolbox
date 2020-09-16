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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var index_1 = require("../index");
var JwtHasuraAuth = /** @class */ (function () {
    function JwtHasuraAuth(store, api, jwtKey, jwtDataCreator, minPasswordLength) {
        if (minPasswordLength === void 0) { minPasswordLength = 10; }
        this.hashLength = 256;
        this.digest = 'sha256';
        this.saltLength = 64;
        this.iterations = 10000;
        this.passwordStore = store;
        this.timeToLive = -1;
        this.revokable = false;
        this.jwtKey = jwtKey;
        this.jwtDataCreator = jwtDataCreator;
        this.api = api;
        this.minPasswordLength = minPasswordLength;
    }
    JwtHasuraAuth.prototype.generatePersistedPassword = function (id, userId, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var salt = crypto_1.default.randomBytes(_this.saltLength).toString('base64');
                        crypto_1.default.pbkdf2(password, salt, _this.iterations, _this.hashLength, _this.digest, function (error, hash) {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve({
                                    id: id,
                                    salt: salt,
                                    userId: userId,
                                    iterations: _this.iterations,
                                    hash: hash.toString('base64')
                                });
                            }
                        });
                    })];
            });
        });
    };
    JwtHasuraAuth.prototype.verifyPersistedPassword = function (persistedPassword, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        crypto_1.default.pbkdf2(password, persistedPassword.salt, persistedPassword.iterations, _this.hashLength, _this.digest, function (error, hash) {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve(persistedPassword.hash === hash.toString('base64'));
                            }
                        });
                    })];
            });
        });
    };
    JwtHasuraAuth.prototype.createToken = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var jwtData, options;
            return __generator(this, function (_a) {
                jwtData = this.jwtDataCreator(user);
                options = this.timeToLive > 0 ? { expiresIn: this.timeToLive } : undefined;
                return [2 /*return*/, jsonwebtoken_1.default.sign(jwtData, this.jwtKey, options)];
            });
        });
    };
    JwtHasuraAuth.prototype.addPassword = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, persistedPassword, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.passwordStore.get(email)];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, Promise.reject(new index_1.HttpError(401, 'email already exists'))];
                        }
                        if (password.length < this.minPasswordLength) {
                            return [2 /*return*/, Promise.reject(new index_1.HttpError(401, "password must be " + this.minPasswordLength + " or more characters long"))];
                        }
                        return [4 /*yield*/, this.api.createUserWithEmail(email)];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, this.generatePersistedPassword(user.email, user.id, password)];
                    case 3:
                        persistedPassword = _a.sent();
                        return [4 /*yield*/, this.passwordStore.put(email, persistedPassword)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.createToken(user)];
                    case 5:
                        token = _a.sent();
                        return [2 /*return*/, { token: token, user: user }];
                }
            });
        });
    };
    JwtHasuraAuth.prototype.verifyPassword = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var persistedPassword, validPassword, user, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.passwordStore.get(email)];
                    case 1:
                        persistedPassword = _a.sent();
                        if (!persistedPassword) {
                            return [2 /*return*/, Promise.reject(new index_1.HttpError(400, 'incorrect id or password'))];
                        }
                        return [4 /*yield*/, this.verifyPersistedPassword(persistedPassword, password)];
                    case 2:
                        validPassword = _a.sent();
                        if (!validPassword) {
                            return [2 /*return*/, Promise.reject(new index_1.HttpError(400, 'incorrect id or password'))];
                        }
                        return [4 /*yield*/, this.api.getUserById(persistedPassword.userId)];
                    case 3:
                        user = _a.sent();
                        return [4 /*yield*/, this.createToken(user)];
                    case 4:
                        token = _a.sent();
                        return [2 /*return*/, { token: token, user: user }];
                }
            });
        });
    };
    return JwtHasuraAuth;
}());
exports.default = JwtHasuraAuth;
//# sourceMappingURL=JwtHasuraAuth.js.map