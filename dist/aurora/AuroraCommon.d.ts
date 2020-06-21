import { CloudFormation, IamRoleStatement } from '../AwsResource';
export declare type AuroraEngine = 'aurora-mysql' | 'aurora-postgresql';
export declare function iamRoleStatements(): IamRoleStatement[];
export declare function cloudFormationForDatabase(
  name: string,
  username: string,
  password: string,
  engine: AuroraEngine
): CloudFormation;
