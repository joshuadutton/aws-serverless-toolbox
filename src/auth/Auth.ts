import { IamPolicyForPrincipal } from '../AwsResource';

export interface ApiGatewayAuthorizerTokenEvent {
  type: 'TOKEN';
  methodArn: string;
  authorizationToken: string;
}

export type Token = string;
export interface Auth {
  addPassword(id: string, password: string, scopes: string[]): Promise<Token>;
  verifyPassword(id: string, password: string): Promise<Token>;
  createToken(id: string, scopes: string[]): Promise<Token>;
  verifyToken(token: Token, scopes: string[]): Promise<string>;
  verifyBearerToken(bearerToken: string | undefined, scopes: string[]): Promise<string>;
  authHandler(event: ApiGatewayAuthorizerTokenEvent, scopes: string[]): Promise<IamPolicyForPrincipal>;
}
