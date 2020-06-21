"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = require("aws-sdk");
var dynamodb_1 = require("aws-sdk/clients/dynamodb");
var AwsResource_1 = require("../AwsResource");
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
var DynamoDbWrapper = /** @class */ (function () {
    function DynamoDbWrapper(region, consistentRead) {
        if (consistentRead === void 0) { consistentRead = true; }
        this.ddb = new aws_sdk_1.DynamoDB({ apiVersion: '2012-08-10', region: region });
        this.db = new dynamodb_1.DocumentClient({ service: this.ddb, convertEmptyValues: true });
        this.consistentRead = consistentRead;
    }
    DynamoDbWrapper.prototype.errorWrapper = function (error, tableName, action) {
        // AWS doesn't namespace errors
        error.code = "DynamoDB:" + error.code;
        error.message = "DynamoDB:" + tableName + ":" + action + " " + error.message;
        return Promise.reject(error);
    };
    DynamoDbWrapper.prototype.get = function (table, key) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db
                        .get({
                        TableName: table,
                        Key: key,
                        ConsistentRead: this.consistentRead
                    })
                        .promise()
                        .then(function (data) {
                        return data === null || data === void 0 ? void 0 : data.Item;
                    })
                        .catch(function (error) { return _this.errorWrapper(error, table, 'get'); })];
            });
        });
    };
    DynamoDbWrapper.prototype.query = function (table, keyExpression, conditionExpression, ExclusiveStartKey, items) {
        if (items === void 0) { items = []; }
        return __awaiter(this, void 0, void 0, function () {
            var params, attributeNames, attributeValues;
            var _this = this;
            return __generator(this, function (_a) {
                params = {
                    TableName: table,
                    ConsistentRead: this.consistentRead,
                    ExclusiveStartKey: ExclusiveStartKey
                };
                attributeNames = {};
                attributeValues = {};
                if (keyExpression) {
                    params.KeyConditionExpression = keyExpression.expression;
                    if (keyExpression.attributeNames) {
                        attributeNames = keyExpression.attributeNames;
                        params.ExpressionAttributeNames = attributeNames;
                    }
                    if (keyExpression.attributeValues) {
                        attributeValues = keyExpression.attributeValues;
                        params.ExpressionAttributeValues = keyExpression.attributeValues;
                    }
                }
                if (conditionExpression) {
                    params.FilterExpression = conditionExpression.expression;
                    if (conditionExpression.attributeNames) {
                        params.ExpressionAttributeNames = __assign(__assign({}, attributeNames), conditionExpression.attributeNames);
                    }
                    if (conditionExpression.attributeValues) {
                        params.ExpressionAttributeValues = __assign(__assign({}, attributeValues), conditionExpression.attributeValues);
                    }
                }
                return [2 /*return*/, this.db
                        .query(params)
                        .promise()
                        .then(function (data) {
                        if (data.Items) {
                            items = items.concat(data.Items);
                        }
                        if (data.LastEvaluatedKey) {
                            // recursively call due to paginated results
                            return _this.query(table, keyExpression, conditionExpression, data.LastEvaluatedKey, items);
                        }
                        return items;
                    })
                        .catch(function (error) { return _this.errorWrapper(error, table, 'query'); })];
            });
        });
    };
    DynamoDbWrapper.prototype.scan = function (table, conditionExpression, ExclusiveStartKey, items) {
        if (items === void 0) { items = []; }
        return __awaiter(this, void 0, void 0, function () {
            var params;
            var _this = this;
            return __generator(this, function (_a) {
                params = {
                    TableName: table,
                    ConsistentRead: this.consistentRead,
                    ExclusiveStartKey: ExclusiveStartKey
                };
                if (conditionExpression) {
                    params.FilterExpression = conditionExpression.expression;
                    params.ExpressionAttributeNames = conditionExpression.attributeNames;
                    params.ExpressionAttributeValues = conditionExpression.attributeValues;
                }
                return [2 /*return*/, this.db
                        .scan(params)
                        .promise()
                        .then(function (data) {
                        if (data.Items) {
                            items = items.concat(data.Items);
                        }
                        if (data.LastEvaluatedKey) {
                            // recursively call due to paginated results
                            return _this.scan(table, conditionExpression, data.LastEvaluatedKey, items);
                        }
                        return items;
                    })
                        .catch(function (error) { return _this.errorWrapper(error, table, 'scan'); })];
            });
        });
    };
    DynamoDbWrapper.prototype.batchGet = function (table, keys) {
        return __awaiter(this, void 0, void 0, function () {
            var requestMap;
            var _a;
            return __generator(this, function (_b) {
                requestMap = (_a = {},
                    _a[table] = {
                        Keys: keys,
                        ConsistentRead: this.consistentRead
                    },
                    _a);
                return [2 /*return*/, this.batchGetWithRequestMap(table, requestMap)];
            });
        });
    };
    DynamoDbWrapper.prototype.put = function (table, item, conditionExpression) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db
                        .put({
                        TableName: table,
                        Item: item,
                        ConditionExpression: conditionExpression
                    })
                        .promise()
                        .catch(function (error) { return _this.errorWrapper(error, table, 'put'); })];
            });
        });
    };
    DynamoDbWrapper.prototype.batchPut = function (table, items) {
        return __awaiter(this, void 0, void 0, function () {
            var requestMap;
            var _a;
            return __generator(this, function (_b) {
                requestMap = (_a = {},
                    _a[table] = items.map(function (item) { return ({ PutRequest: { Item: item } }); }),
                    _a);
                return [2 /*return*/, this.batchWriteWithRequestMap(table, requestMap)];
            });
        });
    };
    DynamoDbWrapper.prototype.delete = function (table, key) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db
                        .delete({
                        TableName: table,
                        Key: key
                    })
                        .promise()
                        .catch(function (error) { return _this.errorWrapper(error, table, 'delete'); })];
            });
        });
    };
    DynamoDbWrapper.prototype.batchDelete = function (table, keys) {
        return __awaiter(this, void 0, void 0, function () {
            var requestMap;
            var _a;
            return __generator(this, function (_b) {
                requestMap = (_a = {},
                    _a[table] = keys.map(function (key) { return ({ DeleteRequest: { Key: key } }); }),
                    _a);
                return [2 /*return*/, this.batchWriteWithRequestMap(table, requestMap)];
            });
        });
    };
    DynamoDbWrapper.prototype.batchGetWithRequestMap = function (table, requestMap, items) {
        if (items === void 0) { items = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db
                        .batchGet({ RequestItems: requestMap })
                        .promise()
                        .then(function (data) {
                        if (!data.Responses) {
                            return items;
                        }
                        items = items.concat(data.Responses[table]);
                        if (data.UnprocessedKeys && Object.keys(data.UnprocessedKeys).length > 0) {
                            // recursively call due to paginated results
                            return _this.batchGetWithRequestMap(table, data.UnprocessedKeys, items);
                        }
                        return items;
                    })
                        .catch(function (error) { return _this.errorWrapper(error, table, 'batchGet'); })];
            });
        });
    };
    DynamoDbWrapper.prototype.batchWriteWithRequestMap = function (table, requestMap) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db
                        .batchWrite({ RequestItems: requestMap })
                        .promise()
                        .then(function (data) {
                        if (data.UnprocessedItems && Object.keys(data.UnprocessedItems).length > 0) {
                            // recursively call due to paginated results
                            return _this.batchWriteWithRequestMap(table, data.UnprocessedItems);
                        }
                    })
                        .catch(function (error) { return _this.errorWrapper(error, table, 'batchGet'); })];
            });
        });
    };
    DynamoDbWrapper.iamRoleStatementForTable = function (name) {
        return {
            Effect: 'Allow',
            Action: [
                'dynamodb:DescribeTable',
                'dynamodb:Query',
                'dynamodb:Scan',
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:BatchGetItem',
                'dynamodb:BatchWriteItem'
            ],
            Resource: AwsResource_1.buildArn('dynamodb', "table/" + name)
        };
    };
    DynamoDbWrapper.cloudFormationForTable = function (name, primaryKey, secondaryKey) {
        var attributes = [{ AttributeName: primaryKey.name, AttributeType: primaryKey.type }];
        var keySchema = [{ AttributeName: primaryKey.name, KeyType: 'HASH' }];
        if (secondaryKey) {
            attributes.push({ AttributeName: secondaryKey.name, AttributeType: secondaryKey.type });
            keySchema.push({ AttributeName: secondaryKey.name, KeyType: 'RANGE' });
        }
        return {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                TableName: name,
                AttributeDefinitions: attributes,
                KeySchema: keySchema,
                BillingMode: 'PAY_PER_REQUEST'
            }
        };
    };
    DynamoDbWrapper.cloudFormationForTableWithId = function (name) {
        return this.cloudFormationForTable(name, { name: 'id', type: 'S' });
    };
    return DynamoDbWrapper;
}());
exports.default = DynamoDbWrapper;
//# sourceMappingURL=DynamoDbWrapper.js.map