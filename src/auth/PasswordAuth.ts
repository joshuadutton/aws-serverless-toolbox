import { IamPolicyForPrincipal } from '../AwsResource';
import { Auth, Token, ApiGatewayAuthorizerTokenEvent } from './Auth';

export interface PersistedPassword {
  salt: string;
  hash: string;
  iterations: number;
  scopes: string[];
}

export interface PasswordAuth extends Auth {
  addPassword(id: string, password: string, scopes: string[]): Promise<Token>;
  verifyPassword(id: string, password: string): Promise<Token>;
  createToken(id: string, scopes: string[]): Promise<Token>;
  verifyToken(token: Token, scopes: string[]): Promise<string>;
  verifyAuthorizationHeaderValue(bearerToken: string | undefined, scopes: string[]): Promise<string>;
  revokeTokenForId(token: Token, id: string): Promise<void>;
  authHandler(event: ApiGatewayAuthorizerTokenEvent, scopes: string[]): Promise<IamPolicyForPrincipal>;
}
