'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.cloudFormationForDatabase = exports.iamRoleStatements = void 0;
// see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html
function iamRoleStatements() {
  return [
    {
      Sid: 'SecretsManagerDbCredentialsAccess',
      Effect: 'Allow',
      Action: [
        'secretsmanager:GetSecretValue',
        'secretsmanager:PutResourcePolicy',
        'secretsmanager:PutSecretValue',
        'secretsmanager:DeleteSecret',
        'secretsmanager:DescribeSecret',
        'secretsmanager:TagResource'
      ],
      Resource: 'arn:aws:secretsmanager:*:*:secret:rds-db-credentials/*'
    },
    {
      Sid: 'RDSDataServiceAccess',
      Effect: 'Allow',
      Action: [
        'secretsmanager:CreateSecret',
        'secretsmanager:ListSecrets',
        'secretsmanager:GetRandomPassword',
        'tag:GetResources',
        'rds-data:BatchExecuteStatement',
        'rds-data:BeginTransaction',
        'rds-data:CommitTransaction',
        'rds-data:ExecuteStatement',
        'rds-data:RollbackTransaction'
      ],
      Resource: '*'
    }
  ];
}
exports.iamRoleStatements = iamRoleStatements;
// see https://stackoverflow.com/questions/51879688/creating-an-aurora-serverless-cluster-from-cloudformation
// TODO: get username and password from secrets manager
function cloudFormationForDatabase(name, username, password, engine) {
  return {
    Type: 'AWS::RDS::DBCluster',
    Properties: {
      MasterUsername: username,
      MasterUserPassword: password,
      DatabaseName: name,
      Engine: engine,
      EngineMode: 'serverless',
      EnableHttpEndpoint: true,
      ScalingConfiguration: {
        AutoPause: true,
        MaxCapacity: 16,
        MinCapacity: 2,
        SecondsUntilAutoPause: 300
      }
    }
  };
}
exports.cloudFormationForDatabase = cloudFormationForDatabase;
//# sourceMappingURL=AuroraCommon.js.map
