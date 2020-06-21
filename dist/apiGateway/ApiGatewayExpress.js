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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var aws_serverless_express_1 = __importDefault(require('aws-serverless-express'));
var middleware_1 = __importDefault(require('aws-serverless-express/middleware'));
var body_parser_1 = __importDefault(require('body-parser'));
var express_1 = __importDefault(require('express'));
var log = __importStar(require('../log'));
var ApiGatewayExpress = /** @class */ (function () {
  function ApiGatewayExpress(routerMap) {
    this.app = express_1.default();
    this.routerMap = routerMap;
    this.setupMiddlewareAndRoutes();
    this.server = aws_serverless_express_1.default.createServer(this.app);
  }
  ApiGatewayExpress.prototype.attachLogInfoMiddleware = function (request, response, next) {
    request.logInfo = { timestamp: Date.now() };
    next();
  };
  ApiGatewayExpress.prototype.attachUserAuthMiddleware = function (request, response, next) {
    var _a, _b, _c, _d;
    var principalId =
      (_d =
        (_c =
          (_b = (_a = request.apiGateway) === null || _a === void 0 ? void 0 : _a.event) === null || _b === void 0
            ? void 0
            : _b.requestContext) === null || _c === void 0
          ? void 0
          : _c.authorizer) === null || _d === void 0
        ? void 0
        : _d.principalId;
    if (principalId) {
      request.auth = { user: { id: principalId } };
    }
    next();
  };
  ApiGatewayExpress.prototype.setupMiddlewareAndRoutes = function () {
    var _this = this;
    this.app.use(this.attachLogInfoMiddleware);
    this.app.use(middleware_1.default.eventContext());
    this.app.use(body_parser_1.default.json());
    this.app.use(log.accessLogMiddleware);
    this.app.use(this.attachUserAuthMiddleware);
    Object.keys(this.routerMap).forEach(function (path) {
      _this.app.use(path, _this.routerMap[path]);
    });
    this.app.use(this.errorMiddleware);
    this.app.use(this.notFoundMiddleware);
  };
  ApiGatewayExpress.prototype.errorMiddleware = function (error, request, response, next) {
    log.error(error);
    var statusCode = error.statusCode || 500;
    var message = error.message || 'Unexpected Server Error';
    response.status(statusCode).json({ statusCode: statusCode, message: message });
  };
  ApiGatewayExpress.prototype.notFoundMiddleware = function (request, response, next) {
    var statusCode = 404;
    response.status(statusCode).json({ statusCode: statusCode, message: 'Not Found' });
  };
  ApiGatewayExpress.prototype.handler = function (event, context) {
    aws_serverless_express_1.default.proxy(this.server, event, context);
  };
  return ApiGatewayExpress;
})();
exports.default = ApiGatewayExpress;
//# sourceMappingURL=ApiGatewayExpress.js.map
