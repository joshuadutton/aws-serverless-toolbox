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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var DataProvider_1 = require('./DataProvider');
var DynamoDbWrapper_1 = __importDefault(require('../dynamoDb/DynamoDbWrapper'));
var ConditionExpression_1 = __importDefault(require('../dynamoDb/ConditionExpression'));
var DynamoDbDataProvider = /** @class */ (function () {
  function DynamoDbDataProvider(region, resourceMap) {
    this.db = new DynamoDbWrapper_1.default(region);
    this.resourceMap = resourceMap;
  }
  // TODO: pagination
  DynamoDbDataProvider.prototype.getList = function (resource, options) {
    return __awaiter(this, void 0, void 0, function () {
      var items;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.queryOrScan(resource, options.filter)];
          case 1:
            items = _a.sent();
            if (options.sort) {
              items = DataProvider_1.sortItems(items, options.sort);
            }
            return [
              2 /*return*/,
              {
                data: items,
                hasNextPage: false
              }
            ];
        }
      });
    });
  };
  DynamoDbDataProvider.prototype.get = function (resource, id) {
    return __awaiter(this, void 0, void 0, function () {
      var item;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.db.get(this.tableForResource(resource), this.keyForResource(resource, id))];
          case 1:
            item = _a.sent();
            return [2 /*return*/, { data: item }];
        }
      });
    });
  };
  DynamoDbDataProvider.prototype.getMany = function (resource, ids) {
    return __awaiter(this, void 0, void 0, function () {
      var items;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.batchGet(
                this.tableForResource(resource),
                ids.map(function (id) {
                  return _this.keyForResource(resource, id);
                })
              )
            ];
          case 1:
            items = _a.sent();
            return [
              2 /*return*/,
              {
                data: items,
                hasNextPage: false
              }
            ];
        }
      });
    });
  };
  DynamoDbDataProvider.prototype.create = function (resource, item) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            item.createdAt = Date.now();
            item.updatedAt = Date.now();
            return [4 /*yield*/, this.db.put(this.tableForResource(resource), item, 'attribute_not_exists(id)')];
          case 1:
            _a.sent();
            return [2 /*return*/, { data: item }];
        }
      });
    });
  };
  DynamoDbDataProvider.prototype.update = function (resource, item) {
    return __awaiter(this, void 0, void 0, function () {
      var key, tableName, original, mergedItem;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            key = this.keyForResource(resource, item.id);
            tableName = this.tableForResource(resource);
            return [4 /*yield*/, this.db.get(tableName, key)];
          case 1:
            original = _a.sent();
            if (!original || !original.createdAt) {
              item.createdAt = Date.now();
            }
            item.updatedAt = Date.now();
            mergedItem = __assign(__assign(__assign({}, original), item), key);
            return [4 /*yield*/, this.db.put(tableName, mergedItem)];
          case 2:
            _a.sent();
            return [
              2 /*return*/,
              {
                data: mergedItem
              }
            ];
        }
      });
    });
  };
  DynamoDbDataProvider.prototype.updateMany = function (resource, items) {
    return __awaiter(this, void 0, void 0, function () {
      var tableName, originals, originalMap, mergedItems;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            tableName = this.tableForResource(resource);
            return [
              4 /*yield*/,
              this.db.batchGet(
                tableName,
                items.map(function (item) {
                  return _this.keyForResource(resource, item.id);
                })
              )
            ];
          case 1:
            originals = _a.sent();
            originalMap = originals.reduce(function (map, item) {
              map[item.id] = item;
              return map;
            }, {});
            mergedItems = items.map(function (item) {
              var original = originalMap[item.id];
              if (!original || !original.createdAt) {
                item.createdAt = Date.now();
              }
              item.updatedAt = Date.now();
              return __assign(__assign({}, original), item);
            });
            return [4 /*yield*/, this.db.batchPut(tableName, mergedItems)];
          case 2:
            _a.sent();
            return [
              2 /*return*/,
              {
                data: mergedItems,
                hasNextPage: false
              }
            ];
        }
      });
    });
  };
  DynamoDbDataProvider.prototype.delete = function (resource, id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.db.delete(this.tableForResource(resource), this.keyForResource(resource, id))];
          case 1:
            _a.sent();
            return [
              2 /*return*/,
              {
                data: id
              }
            ];
        }
      });
    });
  };
  DynamoDbDataProvider.prototype.deleteMany = function (resource, ids) {
    return __awaiter(this, void 0, void 0, function () {
      var keys;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            keys = ids.map(function (id) {
              return _this.keyForResource(resource, id);
            });
            return [4 /*yield*/, this.db.batchDelete(this.tableForResource(resource), keys)];
          case 1:
            _a.sent();
            return [2 /*return*/, { data: ids }];
        }
      });
    });
  };
  DynamoDbDataProvider.prototype.tableForResource = function (resource) {
    return this.resourceMap[resource];
  };
  DynamoDbDataProvider.prototype.keyForResource = function (resource, id) {
    return { id: id };
  };
  DynamoDbDataProvider.prototype.createFilterExpression = function (filter) {
    if (!filter) {
      return undefined;
    }
    var attributes = Object.keys(filter);
    if (!attributes.length) {
      return undefined;
    }
    var addEqualsOrIsInList = function (expression, value) {
      expression = ConditionExpression_1.default.filterWhere(attribute);
      if (Array.isArray(value)) {
        return expression.isIn(value);
      }
      return expression.equals(value);
    };
    var attribute = attributes[0];
    var value = filter[attribute];
    var expression = ConditionExpression_1.default.filterWhere(attribute);
    expression = addEqualsOrIsInList(expression, value);
    for (var i = 1; i < attributes.length; i++) {
      attribute = attributes[i];
      value = filter[attribute];
      expression = expression.and.attribute(attribute);
      expression = addEqualsOrIsInList(expression, value);
    }
    return expression;
  };
  DynamoDbDataProvider.prototype.queryOrScan = function (resource, filter) {
    return __awaiter(this, void 0, void 0, function () {
      var table, _a, id, restFilter, filterExpression, keyExpression;
      return __generator(this, function (_b) {
        table = this.tableForResource(resource);
        (_a = filter || {}), (id = _a.id), (restFilter = __rest(_a, ['id']));
        filterExpression = this.createFilterExpression(restFilter);
        if (id) {
          keyExpression = ConditionExpression_1.default.whereKey('id').equals(id);
          return [2 /*return*/, this.db.query(table, keyExpression, filterExpression)];
        }
        return [2 /*return*/, this.db.scan(table, filterExpression)];
      });
    });
  };
  return DynamoDbDataProvider;
})();
exports.default = DynamoDbDataProvider;
//# sourceMappingURL=DynamoDbDataProvider.js.map
