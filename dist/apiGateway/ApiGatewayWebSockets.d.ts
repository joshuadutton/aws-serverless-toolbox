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
    identity: {
      [key: string]: any;
    };
  };
  headers?: {
    [key: string]: any;
  };
  isBase64Encoded: boolean;
}
export interface ApiGatewayWebSocketResult {
  statusCode: number;
}
export declare function sendWebSocketMessage(connectionId: string, endpoint: string, message: any): Promise<any>;
export declare function iamRoleStatementInvokeWebSockets(): IamRoleStatement;
