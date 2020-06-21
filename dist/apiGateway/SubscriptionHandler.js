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
exports.SubscriberMap = exports.Subscription = exports.PushNotificationSubscriber = exports.WebSocketSubscriber = exports.SubscriberType = void 0;
var ApiGatewayWebSockets_1 = __importDefault(require("./ApiGatewayWebSockets"));
var SubscriberType;
(function (SubscriberType) {
    SubscriberType["WebSocket"] = "WebSocket";
    SubscriberType["PushNotification"] = "PushNotification";
})(SubscriberType = exports.SubscriberType || (exports.SubscriberType = {}));
var GONE_EXCEPTION_STATUS_CODE = 410;
var WebSocketSubscriber = /** @class */ (function () {
    function WebSocketSubscriber(id, endpoint) {
        this.type = SubscriberType.WebSocket;
        this.id = id;
        this.endpoint = endpoint;
    }
    return WebSocketSubscriber;
}());
exports.WebSocketSubscriber = WebSocketSubscriber;
var PushNotificationSubscriber = /** @class */ (function () {
    function PushNotificationSubscriber(id) {
        this.type = SubscriberType.PushNotification;
        this.id = id;
    }
    return PushNotificationSubscriber;
}());
exports.PushNotificationSubscriber = PushNotificationSubscriber;
var Subscription = /** @class */ (function () {
    function Subscription(thingId) {
        this.cacheName = 'Subscription';
        this.subscribers = new Array();
        this.toThingId = thingId;
    }
    return Subscription;
}());
exports.Subscription = Subscription;
var SubscriberMap = /** @class */ (function () {
    function SubscriberMap(subscriberId, thingId) {
        this.cacheName = 'SubscriberMap';
        this.subscriberId = subscriberId;
        this.thingId = thingId;
    }
    return SubscriberMap;
}());
exports.SubscriberMap = SubscriberMap;
var SubscriptionHandler = /** @class */ (function () {
    function SubscriptionHandler(store) {
        this.subscriptionStore = store;
    }
    SubscriptionHandler.prototype.getSubscriptionForThing = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.subscriptionStore.get(id)];
            });
        });
    };
    SubscriptionHandler.prototype.getSubscriberMapForSubscriber = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.subscriptionStore.get(id)];
            });
        });
    };
    SubscriptionHandler.prototype.subscribe = function (thingId, subscriber) {
        return __awaiter(this, void 0, void 0, function () {
            var subscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSubscriptionForThing(thingId)];
                    case 1:
                        subscription = _a.sent();
                        if (!subscription) {
                            subscription = new Subscription(thingId);
                        }
                        subscription.subscribers.push(subscriber);
                        return [4 /*yield*/, this.subscriptionStore.put(thingId, subscription)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.subscriptionStore.put(subscriber.id, new SubscriberMap(subscriber.id, thingId))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SubscriptionHandler.prototype.unsubscribe = function (subscriberId) {
        return __awaiter(this, void 0, void 0, function () {
            var subscriberMap, thingId_1, subscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSubscriberMapForSubscriber(subscriberId)];
                    case 1:
                        subscriberMap = _a.sent();
                        if (!subscriberMap) return [3 /*break*/, 8];
                        thingId_1 = subscriberMap.thingId;
                        return [4 /*yield*/, this.getSubscriptionForThing(thingId_1)];
                    case 2:
                        subscription = _a.sent();
                        if (!subscription) return [3 /*break*/, 6];
                        subscription.subscribers = subscription.subscribers.splice(subscription.subscribers.findIndex(function (subscriber) { return subscriber.id === thingId_1; }), 1);
                        if (!(subscription.subscribers.length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.subscriptionStore.delete(thingId_1)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.subscriptionStore.put(thingId_1, subscription)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.subscriptionStore.delete(subscriberId)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SubscriptionHandler.prototype.sendMessageToSubscribers = function (thingId, message) {
        return __awaiter(this, void 0, void 0, function () {
            var subscription, promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSubscriptionForThing(thingId)];
                    case 1:
                        subscription = _a.sent();
                        if (subscription) {
                            promises = subscription.subscribers.map(function (subscriber) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    if (subscriber instanceof WebSocketSubscriber) {
                                        subscriber.endpoint;
                                    }
                                    switch (subscriber.type) {
                                        case SubscriberType.WebSocket: {
                                            return [2 /*return*/, ApiGatewayWebSockets_1.default.sendWebSocketMessage(subscriber.id, subscriber.endpoint, JSON.stringify(message)).catch(function (error) {
                                                    if (error.errno === 'ECONNREFUSED' || error.statusCode === GONE_EXCEPTION_STATUS_CODE) {
                                                        return _this.unsubscribe(subscriber.id);
                                                    }
                                                    throw error;
                                                })];
                                        }
                                        case SubscriberType.PushNotification: {
                                            return [2 /*return*/, Promise.reject('PushNotifications not implemented yet')];
                                        }
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            return [2 /*return*/, Promise.all(promises)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return SubscriptionHandler;
}());
exports.default = SubscriptionHandler;
//# sourceMappingURL=SubscriptionHandler.js.map