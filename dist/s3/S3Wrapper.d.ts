/// <reference types="node" />
import { IamRoleStatement, CloudFormation } from '../AwsResource';
export default class S3Wrapper {
    private readonly s3;
    constructor();
    private errorWrapper;
    get(bucket: string, key: string): Promise<string | Buffer | Uint8Array | undefined>;
    getJson(bucket: string, key: string): Promise<any>;
    put(bucket: string, key: string, value: string | Buffer | undefined, contentType?: string): Promise<void>;
    putJson(bucket: string, key: string, value: any): Promise<void>;
    delete(bucket: string, key: string): Promise<void>;
    getAllKeys(bucket: string, prefix?: string, keys?: string[], continuationToken?: string): any;
    static iamRoleStatementForBucket: (name: string) => IamRoleStatement;
    static cloudFormationForBucket: (name: string) => CloudFormation;
}
