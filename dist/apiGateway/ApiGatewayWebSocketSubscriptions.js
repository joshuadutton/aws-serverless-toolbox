"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var log = __importStar(require("../log"));
var SubscriptionHandler_1 = require("./SubscriptionHandler");
var ApiGatewayWebSockets_1 = __importDefault(require("./ApiGatewayWebSockets"));
var ApiGatewayWebSocketSubscriptions = /** @class */ (function () {
    function ApiGatewayWebSocketSubscriptions(subscriptionHandler, auth, scopes) {
        this.subscriptionHandler = subscriptionHandler;
        this.auth = auth;
        this.scopes = scopes;
    }
    ApiGatewayWebSocketSubscriptions.prototype.handler = function (event, context) {
        return __awaiter(this, void 0, void 0, function () {
            var connectionId, routeKey, domain, stage, headers, endpoint, authorization, id, _a, subscriber, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        connectionId = event.requestContext.connectionId;
                        routeKey = event.requestContext.routeKey;
                        domain = event.requestContext.domainName;
                        stage = event.requestContext.stage;
                        headers = event.headers;
                        endpoint = "https://" + domain;
                        if (domain === 'localhost') {
                            endpoint = 'http://localhost:3001';
                        }
                        else if (domain.includes('amazonaws.com')) {
                            endpoint = "https://" + domain + "/" + stage;
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, , 11]);
                        authorization = headers['Authorization'] || "Bearer " + headers['Sec-WebSocket-Protocol'];
                        return [4 /*yield*/, this.auth.verifyBearerToken(authorization, this.scopes)];
                    case 2:
                        id = _b.sent();
                        log.logApiGatewayWebsocket(routeKey, endpoint, connectionId, id);
                        _a = routeKey;
                        switch (_a) {
                            case '$connect': return [3 /*break*/, 3];
                            case '$disconnect': return [3 /*break*/, 5];
                            case '$default': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 8];
                    case 3:
                        subscriber = new SubscriptionHandler_1.WebSocketSubscriber(connectionId, endpoint);
                        return [4 /*yield*/, this.subscriptionHandler.subscribe(id, subscriber)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, this.subscriptionHandler.unsubscribe(connectionId)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7: throw new Error("incoming messages not supported");
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        error_1 = _b.sent();
                        error_1.statusCode = error_1.statusCode || 500;
                        log.error(error_1);
                        return [4 /*yield*/, ApiGatewayWebSockets_1.default.sendWebSocketMessage(connectionId, endpoint, "" + error_1)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, { statusCode: 200 }];
                }
            });
        });
    };
    return ApiGatewayWebSocketSubscriptions;
}());
exports.default = ApiGatewayWebSocketSubscriptions;
//# sourceMappingURL=ApiGatewayWebSocketSubscriptions.js.map