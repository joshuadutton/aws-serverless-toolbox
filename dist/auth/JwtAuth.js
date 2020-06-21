'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          }
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod) if (k !== 'default' && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var crypto_1 = __importDefault(require('crypto'));
var jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
var log = __importStar(require('../log'));
var HttpError_1 = __importDefault(require('../apiGateway/HttpError'));
var JwtAuth = /** @class */ (function () {
  function JwtAuth(store, timeToLive, revokable) {
    if (timeToLive === void 0) {
      timeToLive = 3600;
    }
    if (revokable === void 0) {
      revokable = false;
    }
    this.hashLength = 256;
    this.digest = 'sha256';
    this.saltLength = 64;
    this.iterations = 10000;
    this.signingKeyId = '927cde40-41e7-45b1-861a-864f6d6ec269'; // uuid to not conflict with other ids
    this.passwordStore = store;
    this.timeToLive = timeToLive;
    this.revokable = revokable;
  }
  JwtAuth.prototype.getSigningSecret = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (this.signingSecretAsPersistedPassword) {
              // Lambda memory persists if the function is kept warm
              // use this carefully
              return [2 /*return*/, this.signingSecretAsPersistedPassword.hash];
            }
            _a = this;
            return [4 /*yield*/, this.passwordStore.get(this.signingKeyId)];
          case 1:
            _a.signingSecretAsPersistedPassword = _b.sent();
            if (this.signingSecretAsPersistedPassword) {
              return [2 /*return*/, this.signingSecretAsPersistedPassword.hash];
            }
            // this should only ever happen once
            // creates a random key that will be used for all JWTs
            this.signingSecretAsPersistedPassword = {
              salt: crypto_1.default.randomBytes(this.saltLength).toString('base64'),
              hash: crypto_1.default.randomBytes(this.hashLength).toString('base64'),
              iterations: this.iterations,
              scopes: ['system']
            };
            return [4 /*yield*/, this.passwordStore.put(this.signingKeyId, this.signingSecretAsPersistedPassword)];
          case 2:
            _b.sent();
            return [2 /*return*/, this.signingSecretAsPersistedPassword.hash];
        }
      });
    });
  };
  JwtAuth.prototype.generatePersistedPassword = function (password, scopes) {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          new Promise(function (resolve, reject) {
            var salt = crypto_1.default.randomBytes(_this.saltLength).toString('base64');
            crypto_1.default.pbkdf2(password, salt, _this.iterations, _this.hashLength, _this.digest, function (error, hash) {
              if (error) {
                reject(error);
              } else {
                resolve({
                  salt: salt,
                  scopes: scopes,
                  iterations: _this.iterations,
                  hash: hash.toString('base64')
                });
              }
            });
          })
        ];
      });
    });
  };
  JwtAuth.prototype.verifyPersistedPassword = function (persistedPassword, password) {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          new Promise(function (resolve, reject) {
            crypto_1.default.pbkdf2(
              password,
              persistedPassword.salt,
              persistedPassword.iterations,
              _this.hashLength,
              _this.digest,
              function (error, hash) {
                if (error) {
                  reject(error);
                } else {
                  resolve(persistedPassword.hash === hash.toString('base64'));
                }
              }
            );
          })
        ];
      });
    });
  };
  JwtAuth.prototype.createToken = function (id, scopes) {
    return __awaiter(this, void 0, void 0, function () {
      var signingSecret, jwtData, options;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.getSigningSecret()];
          case 1:
            signingSecret = _a.sent();
            jwtData = {
              sub: id,
              scopes: scopes
            };
            options = this.timeToLive > 0 ? { expiresIn: this.timeToLive } : undefined;
            return [2 /*return*/, jsonwebtoken_1.default.sign(jwtData, signingSecret, options)];
        }
      });
    });
  };
  JwtAuth.prototype.verifyToken = function (token, scopes) {
    return __awaiter(this, void 0, void 0, function () {
      var signingSecret, decoded, scopeFound, _i, scopes_1, scope, persistedPassword, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.getSigningSecret()];
          case 1:
            signingSecret = _a.sent();
            _a.label = 2;
          case 2:
            _a.trys.push([2, 5, , 6]);
            decoded = jsonwebtoken_1.default.verify(token, signingSecret);
            scopeFound = false;
            for (_i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
              scope = scopes_1[_i];
              if (decoded.scopes.includes(scope)) {
                scopeFound = true;
                break;
              }
            }
            if (!scopeFound) {
              return [2 /*return*/, Promise.reject('invalid scope')];
            }
            if (!this.revokable) return [3 /*break*/, 4];
            return [4 /*yield*/, this.passwordStore.get(decoded.sub)];
          case 3:
            persistedPassword = _a.sent();
            if (persistedPassword) {
              return [2 /*return*/, decoded.sub];
            } else {
              return [2 /*return*/, Promise.reject('unauthorized')];
            }
            _a.label = 4;
          case 4:
            return [2 /*return*/, decoded.sub];
          case 5:
            error_1 = _a.sent();
            return [2 /*return*/, Promise.reject(error_1)];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  JwtAuth.prototype.addPassword = function (id, password, scopes) {
    return __awaiter(this, void 0, void 0, function () {
      var persistedPassword;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.passwordStore.get(id)];
          case 1:
            if (_a.sent()) {
              return [2 /*return*/, Promise.reject('id already exits')];
            }
            if (password.length < 10) {
              return [2 /*return*/, Promise.reject('password must be 10 or more characters long')];
            }
            return [4 /*yield*/, this.generatePersistedPassword(password, scopes)];
          case 2:
            persistedPassword = _a.sent();
            return [4 /*yield*/, this.passwordStore.put(id, persistedPassword)];
          case 3:
            _a.sent();
            return [2 /*return*/, this.createToken(id, scopes)];
        }
      });
    });
  };
  JwtAuth.prototype.verifyPassword = function (id, password) {
    return __awaiter(this, void 0, void 0, function () {
      var persistedPassword, validPassword;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.passwordStore.get(id)];
          case 1:
            persistedPassword = _a.sent();
            if (!persistedPassword) {
              return [2 /*return*/, Promise.reject('incorrect id or password')];
            }
            return [4 /*yield*/, this.verifyPersistedPassword(persistedPassword, password)];
          case 2:
            validPassword = _a.sent();
            if (!validPassword) {
              return [2 /*return*/, Promise.reject('incorrect id or password')];
            }
            return [2 /*return*/, this.createToken(id, persistedPassword.scopes)];
        }
      });
    });
  };
  JwtAuth.prototype.verifyBearerToken = function (bearerToken, scopes) {
    return __awaiter(this, void 0, void 0, function () {
      var token;
      return __generator(this, function (_a) {
        try {
          if (!bearerToken) {
            throw new Error('no bearerToken');
          }
          token = bearerToken.substring(7);
          return [2 /*return*/, this.verifyToken(token, scopes)];
        } catch (error) {
          log.error(error);
          return [2 /*return*/, Promise.reject(new HttpError_1.default(403, 'unauthorized'))];
        }
        return [2 /*return*/];
      });
    });
  };
  JwtAuth.prototype.revokeTokenForId = function (token, id) {
    return __awaiter(this, void 0, void 0, function () {
      var persistedPassword, tokenId, error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.revokable) {
              return [2 /*return*/, Promise.reject('revocation not allowed')];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 6, , 7]);
            return [4 /*yield*/, this.passwordStore.get(id)];
          case 2:
            persistedPassword = _a.sent();
            if (!persistedPassword) return [3 /*break*/, 5];
            return [4 /*yield*/, this.verifyToken(token, persistedPassword.scopes)];
          case 3:
            tokenId = _a.sent();
            if (!(tokenId == id)) return [3 /*break*/, 5];
            return [4 /*yield*/, this.passwordStore.delete(id)];
          case 4:
            _a.sent();
            return [2 /*return*/];
          case 5:
            return [3 /*break*/, 7];
          case 6:
            error_2 = _a.sent();
            return [3 /*break*/, 7];
          case 7:
            return [2 /*return*/, Promise.reject('revocation unsuccessful')];
        }
      });
    });
  };
  JwtAuth.prototype.authHandler = function (event, scopes) {
    return __awaiter(this, void 0, void 0, function () {
      var bearerToken, sub, error_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            bearerToken = event.authorizationToken;
            return [4 /*yield*/, this.verifyBearerToken(bearerToken, scopes)];
          case 1:
            sub = _a.sent();
            log.info('success');
            return [2 /*return*/, this.generateIamPolicy({ id: sub }, 'Allow', event.methodArn)];
          case 2:
            error_3 = _a.sent();
            log.error(error_3);
            return [2 /*return*/, this.generateIamPolicy({}, 'Deny', event.methodArn)];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  JwtAuth.prototype.generateIamPolicy = function (userInfo, effect, resource) {
    return {
      principalId: userInfo.id,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: effect,
            Action: 'execute-api:Invoke',
            Resource: resource
          }
        ]
      },
      context: userInfo
    };
  };
  return JwtAuth;
})();
exports.default = JwtAuth;
//# sourceMappingURL=JwtAuth.js.map
