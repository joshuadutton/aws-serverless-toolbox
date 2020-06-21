import { IamPolicyForPrincipal } from '../AwsResource';
import { Auth, Token, ApiGatewayAuthorizerTokenEvent } from './Auth';
import ObjectStore from '../objectStore/ObjectStore';
export interface PersistedPassword {
  salt: string;
  hash: string;
  iterations: number;
  scopes: string[];
}
export default class JwtAuth implements Auth {
  private readonly hashLength;
  private readonly digest;
  private readonly saltLength;
  private readonly iterations;
  private readonly signingKeyId;
  private signingSecretAsPersistedPassword?;
  private readonly passwordStore;
  private readonly timeToLive;
  private readonly revokable;
  constructor(store: ObjectStore<PersistedPassword>, timeToLive?: number, revokable?: boolean);
  private getSigningSecret;
  generatePersistedPassword(password: string, scopes: string[]): Promise<PersistedPassword>;
  private verifyPersistedPassword;
  createToken(id: string, scopes: string[]): Promise<Token>;
  verifyToken(token: Token, scopes: string[]): Promise<string>;
  addPassword(id: string, password: string, scopes: string[]): Promise<Token>;
  verifyPassword(id: string, password: string): Promise<Token>;
  verifyBearerToken(bearerToken: string | undefined, scopes: string[]): Promise<string>;
  revokeTokenForId(token: Token, id: string): Promise<void>;
  authHandler(event: ApiGatewayAuthorizerTokenEvent, scopes: string[]): Promise<IamPolicyForPrincipal>;
  private generateIamPolicy;
}
