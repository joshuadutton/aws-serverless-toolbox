'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var aws_sdk_1 = require('aws-sdk');
var AuroraCommon_1 = require('./AuroraCommon');
// https://github.com/aws-samples/aws-aurora-serverless-data-api-sam
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDSDataService.html
// https://aws.amazon.com/blogs/database/using-the-data-api-to-interact-with-an-amazon-aurora-serverless-mysql-database/
// https://aws.amazon.com/blogs/compute/using-amazon-rds-proxy-with-aws-lambda/
var AuroraWrapper = /** @class */ (function () {
  function AuroraWrapper() {
    this.dataService = new aws_sdk_1.RDSDataService({ apiVersion: '2018-08-01' });
  }
  AuroraWrapper.iamRoleStatements = function () {
    return AuroraCommon_1.iamRoleStatements();
  };
  AuroraWrapper.cloudFormationForDatabase = function (name, username, password) {
    return AuroraCommon_1.cloudFormationForDatabase(name, username, password, 'aurora-mysql');
  };
  return AuroraWrapper;
})();
exports.default = AuroraWrapper;
//# sourceMappingURL=AuroraMySqlWrapper.js.map
