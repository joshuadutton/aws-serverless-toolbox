'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var ObjectStore_1 = require('./ObjectStore');
var DynamoDbWrapper_1 = __importDefault(require('../dynamoDb/DynamoDbWrapper'));
var DynamoObjectDBStore = /** @class */ (function () {
  function DynamoObjectDBStore(tableName, region, timeToLiveSeconds, expiresKey) {
    if (expiresKey === void 0) {
      expiresKey = 'expires';
    }
    this.db = new DynamoDbWrapper_1.default(region);
    this.tableName = tableName;
    this.timeToLiveSeconds = timeToLiveSeconds;
    this.expiresKey = expiresKey;
  }
  DynamoObjectDBStore.prototype.createExpires = function (timeToLiveSeconds) {
    var timestampSeconds = new Date().getTime() / 1000;
    return timestampSeconds + timeToLiveSeconds;
  };
  DynamoObjectDBStore.prototype.get = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var item;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.db.get(this.tableName, { id: id })];
          case 1:
            item = _a.sent();
            if (this.timeToLiveSeconds && item[this.expiresKey]) {
              if (item[this.expiresKey] < Date.now() / 1000) {
                return [2 /*return*/, undefined];
              }
            }
            return [2 /*return*/, item];
        }
      });
    });
  };
  DynamoObjectDBStore.prototype.put = function (id, item) {
    return __awaiter(this, void 0, void 0, function () {
      var putItem;
      return __generator(this, function (_a) {
        putItem = __assign(__assign({}, item), { id: id });
        if (this.timeToLiveSeconds) {
          putItem[this.expiresKey] = this.createExpires(this.timeToLiveSeconds);
        }
        return [2 /*return*/, this.db.put(this.tableName, putItem)];
      });
    });
  };
  DynamoObjectDBStore.prototype.delete = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        this.db.delete(this.tableName, { id: id });
        return [2 /*return*/];
      });
    });
  };
  DynamoObjectDBStore.prototype.updateState = function (id, action, reducer) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, ObjectStore_1.actionHandler(this, id, action, reducer)];
      });
    });
  };
  return DynamoObjectDBStore;
})();
exports.default = DynamoObjectDBStore;
//# sourceMappingURL=DynamoDbObjectStore.js.map
