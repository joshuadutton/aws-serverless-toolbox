import { CloudFormation, IamRoleStatement } from '../AwsResource';

export type AuroraEngine = 'aurora-mysql' | 'aurora-postgresql';

// see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html
export function iamRoleStatements(): IamRoleStatement[] {
  return [
    {
      Sid: 'SecretsManagerDbCredentialsAccess',
      Effect: 'Allow',
      Action: ['secretsmanager:GetSecretValue'],
      Resource: 'arn:aws:secretsmanager:*:*:secret:rds-db-credentials/*'
    },
    {
      Sid: 'RDSDataServiceAccess',
      Effect: 'Allow',
      Action: [
        'rds-data:ExecuteStatement',
        'rds-data:BatchExecuteStatement',
        'rds-data:BeginTransaction',
        'rds-data:RollbackTransaction',
        'rds-data:CommitTransaction'
      ],
      Resource: '*'
    }
  ];
}

// see https://stackoverflow.com/questions/51879688/creating-an-aurora-serverless-cluster-from-cloudformation
// TODO: get username and password from secrets manager
export function cloudFormationForDatabase(
  name: string,
  username: string,
  password: string,
  engine: AuroraEngine
): CloudFormation {
  return {
    Type: 'AWS::RDS::DBCluster',
    Properties: {
      MasterUsername: username,
      MasterUserPassword: password,
      DatabaseName: name,
      Engine: engine,
      EngineMode: 'serverless',
      EnableHttpEndpoint: true, // enables data api
      ScalingConfiguration: {
        AutoPause: true,
        MaxCapacity: 16,
        MinCapacity: 2,
        SecondsUntilAutoPause: 300
      }
    }
  };
}
