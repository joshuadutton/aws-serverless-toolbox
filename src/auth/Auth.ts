import { IamPolicyForPrincipal } from '../AwsResource';

export interface ApiGatewayAuthorizerTokenEvent {
  type: 'TOKEN';
  methodArn: string;
  authorizationToken: string;
}

export type Token = string;
export interface Auth {
  verifyToken(token: Token, scopes: string[]): Promise<string>;
  verifyAuthorizationHeaderValue(bearerToken: string | undefined, scopes: string[]): Promise<string>;
  authHandler(event: ApiGatewayAuthorizerTokenEvent, scopes: string[]): Promise<IamPolicyForPrincipal>;
}
