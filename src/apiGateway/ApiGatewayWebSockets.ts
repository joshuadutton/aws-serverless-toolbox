import { ApiGatewayManagementApi, AWSError } from 'aws-sdk';
import { Context } from 'aws-lambda';
import { IamRoleStatement } from '../AwsResource';

export interface ApiGatewayWebSocketEvent {
  requestContext: {
    routeKey: string;
    connectionId: string;
    messageId?: string;
    eventType: string;
    extendedRequestId: string;
    requestTime: string;
    messageDirection: string;
    connectedAt: number;
    requestTimeEpoch: number;
    requestId: string;
    domainName: string;
    stage: string;
    apiId: string;
    identity: { [key: string]: any };
  };
  headers?: { [key: string]: any };
  isBase64Encoded: boolean;
}

export interface ApiGatewayWebSocketResult {
  statusCode: number;
}

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayManagementApi.html
export async function sendWebSocketMessage(connectionId: string, endpoint: string, message: any): Promise<any> {
  const apiGateway = new ApiGatewayManagementApi({ endpoint, apiVersion: '2029' });

  return apiGateway
    .postToConnection({
      ConnectionId: connectionId,
      Data: message
    })
    .promise()
    .catch((error) => errorWrapper(error, 'postToConnection', endpoint));
}

export function iamRoleStatementInvokeWebSockets(): IamRoleStatement {
  return {
    Effect: 'Allow',
    Action: 'execute-api:Invoke',
    Resource: 'arn:aws:execute-api:*:*:*'
  };
}

function errorWrapper(error: AWSError, action: string, endpoint: string): Promise<any> {
  // AWS doesn't namespace errors
  error.code = `ApiGatewayManagementApi:${error.code}`;
  error.message = `ApiGatewayManagementApi:${action}:${endpoint} ${error.message}`;
  return Promise.reject(error);
}
