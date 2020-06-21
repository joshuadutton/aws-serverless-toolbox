'use strict';
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
Object.defineProperty(exports, '__esModule', { value: true });
var aws_sdk_1 = require('aws-sdk');
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
var S3Wrapper = /** @class */ (function () {
  function S3Wrapper() {
    this.s3 = new aws_sdk_1.S3();
  }
  S3Wrapper.prototype.errorWrapper = function (error, bucketName, action) {
    // AWS doesn't namespace errors
    error.code = 'S3:' + error.code;
    error.message = 'S3:' + bucketName + ':' + action + ' ' + error.message;
    return Promise.reject(error);
  };
  S3Wrapper.prototype.get = function (bucket, key) {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.s3
            .getObject({
              Bucket: bucket,
              Key: key
            })
            .promise()
            .then(function (object) {
              return object.Body;
            })
            .catch(function (error) {
              return _this.errorWrapper(error, bucket, 'getObject');
            })
        ];
      });
    });
  };
  S3Wrapper.prototype.getJson = function (bucket, key) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.get(bucket, key).then(function (body) {
            if (body) {
              return JSON.parse(body.toString('utf8'));
            }
          })
        ];
      });
    });
  };
  S3Wrapper.prototype.put = function (bucket, key, value, contentType) {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.s3
            .putObject({
              Bucket: bucket,
              Key: key,
              Body: value,
              ContentType: contentType,
              CacheControl: 'max-age=0'
            })
            .promise()
            .catch(function (error) {
              return _this.errorWrapper(error, bucket, 'putObject');
            })
        ];
      });
    });
  };
  S3Wrapper.prototype.putJson = function (bucket, key, value) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, this.put(bucket, key, JSON.stringify(value))];
      });
    });
  };
  S3Wrapper.prototype.delete = function (bucket, key) {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.s3
            .deleteObject({
              Bucket: bucket,
              Key: key
            })
            .promise()
            .catch(function (error) {
              return _this.errorWrapper(error, bucket, 'deleteObject');
            })
        ];
      });
    });
  };
  S3Wrapper.prototype.getAllKeys = function (bucket, prefix, keys, continuationToken) {
    if (keys === void 0) {
      keys = [];
    }
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.s3
            .listObjectsV2({
              Bucket: bucket,
              Prefix: prefix,
              ContinuationToken: continuationToken
            })
            .promise()
            .then(function (result) {
              if (result.Contents) {
                var justKeys = result.Contents.map(function (object) {
                  return object.Key;
                }).filter(function (key) {
                  return key !== undefined;
                });
                keys = keys.concat(justKeys);
              }
              if (result.ContinuationToken) {
                return _this.getAllKeys(bucket, prefix, keys, result.ContinuationToken);
              }
              return keys;
            })
            .catch(function (error) {
              return _this.errorWrapper(error, bucket, 'listObjectsV2');
            })
        ];
      });
    });
  };
  S3Wrapper.iamRoleStatementForBucket = function (name) {
    return {
      Effect: 'Allow',
      Action: ['s3:ListBucket', 's3:PutObject', 's3:GetObject', 's3:DeleteObject'],
      Resource: ['arn:aws:s3:::' + name, 'arn:aws:s3:::' + name + '/*']
    };
  };
  S3Wrapper.cloudFormationForBucket = function (name) {
    return {
      Type: 'AWS::S3::Bucket',
      Properties: {
        BucketName: name
      }
    };
  };
  return S3Wrapper;
})();
exports.default = S3Wrapper;
//# sourceMappingURL=S3Wrapper.js.map
