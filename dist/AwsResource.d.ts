export declare type IamRoleStatement = {
    Sid?: string;
    Effect: 'Allow' | 'Deny';
    Action: string | string[];
    Resource: string | string[];
};
export interface IamPolicy {
    Version: string;
    Statement: IamRoleStatement[];
}
export interface IamPolicyForPrincipal {
    principalId: string;
    policyDocument: IamPolicy;
    context: any;
}
export declare type CloudFormation = {
    Type: string;
    Properties: {
        [key: string]: any;
    };
};
export declare function buildArn(service: string, resource: string, region?: string, accountId?: string): string;
