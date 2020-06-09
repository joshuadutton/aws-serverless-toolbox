import { CloudFormation, IamRoleStatement } from "../AwsResource";
import { RDSDataService } from "aws-sdk";
import { cloudFormationForDatabase, iamRoleStatements } from "./AuroraCommon";

// https://github.com/aws-samples/aws-aurora-serverless-data-api-sam
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDSDataService.html
// https://aws.amazon.com/blogs/database/using-the-data-api-to-interact-with-an-amazon-aurora-serverless-mysql-database/
// https://aws.amazon.com/blogs/compute/using-amazon-rds-proxy-with-aws-lambda/
export default class AuroraWrapper {
  dataService = new RDSDataService({apiVersion: '2018-08-01'});
  
  constructor() {

  }

  static iamRoleStatements = function(): IamRoleStatement[] {
    return iamRoleStatements();
  }

  static cloudFormationForDatabase = function(name: string, username: string, password: string): CloudFormation {
    return cloudFormationForDatabase(name, username, password, "aurora-mysql");
  }
}
