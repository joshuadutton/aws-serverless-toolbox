'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildArn = void 0;
function buildArn(service, resource, region, accountId) {
  if (region === void 0) {
    region = 'us-east-1';
  }
  if (accountId === void 0) {
    accountId = '*';
  }
  if (!service) {
    throw new Error('aws service name required (e.g. dynamodb)');
  }
  if (!resource) {
    throw new Error('aws resource name required (e.g. table/my-table-name)');
  }
  return 'arn:aws:' + service + ':' + region + ':' + accountId + ':' + resource;
}
exports.buildArn = buildArn;
//# sourceMappingURL=AwsResource.js.map
