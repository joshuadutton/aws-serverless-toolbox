export type IamRoleStatement = { 
  Effect: "Allow" | "Deny",
  Action: string | string[],
  Resource: string | string[]
}

export interface IamPolicy {
  Version: string,
  Statement: IamRoleStatement[]
}

export interface IamPolicyForPrincipal {
  principalId: string,
  policyDocument: IamPolicy,
  context: any,
}

export type CloudFormation = {
  Type: string,
  Properties: {
    Name: string,
    [key: string]: any
  }
}

export interface IamRoleStatementsFunction {
  (name: string): IamRoleStatement[];
}
export interface CloudFormationFunction {
  (name: string): CloudFormation;
}
