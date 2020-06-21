import { CloudFormation, IamRoleStatement } from '../AwsResource';
import { RDSDataService } from 'aws-sdk';
export default class AuroraWrapper {
    dataService: RDSDataService;
    constructor();
    static iamRoleStatements: () => IamRoleStatement[];
    static cloudFormationForDatabase: (name: string, username: string, password: string) => CloudFormation;
}
