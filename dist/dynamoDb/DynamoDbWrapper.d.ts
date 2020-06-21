import { DocumentClient, ScalarAttributeType } from 'aws-sdk/clients/dynamodb';
import ConditionExpression from './ConditionExpression';
import { CloudFormation, IamRoleStatement } from '../AwsResource';
export declare type Key = DocumentClient.Key;
export default class DynamoDbWrapper {
  private readonly ddb;
  private readonly db;
  private readonly consistentRead;
  constructor(region: string, consistentRead?: boolean);
  private errorWrapper;
  get(table: string, key: Key): Promise<any>;
  query(
    table: string,
    keyExpression?: ConditionExpression,
    conditionExpression?: ConditionExpression,
    ExclusiveStartKey?: Key,
    items?: any
  ): any;
  scan(table: string, conditionExpression?: ConditionExpression, ExclusiveStartKey?: Key, items?: any): any;
  batchGet(table: string, keys: Key[]): Promise<any>;
  put(table: string, item: any, conditionExpression?: string): Promise<any>;
  batchPut(table: string, items: any[]): Promise<any>;
  delete(table: string, key: Key): Promise<any>;
  batchDelete(table: string, keys: Key[]): Promise<any>;
  static iamRoleStatementForTable: (name: string) => IamRoleStatement;
  static cloudFormationForTable: (
    name: string,
    primaryKey: {
      name: string;
      type: ScalarAttributeType;
    },
    secondaryKey?:
      | {
          name: string;
          type: ScalarAttributeType;
        }
      | undefined
  ) => CloudFormation;
  static cloudFormationForTableWithId: (name: string) => CloudFormation;
  private batchGetWithRequestMap;
  private batchWriteWithRequestMap;
}
