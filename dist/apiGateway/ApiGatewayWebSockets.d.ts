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
    body?: string;
}
export interface ApiGatewayWebSocketResult {
    statusCode: number;
}
export default class ApiGatewayWebSockets {
    static sendWebSocketMessage(connectionId: string, endpoint: string, message: any): Promise<any>;
    static iamRoleStatementInvokeWebSockets(): IamRoleStatement;
}
