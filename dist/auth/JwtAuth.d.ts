import { IamPolicyForPrincipal } from '../AwsResource';
import { PasswordAuth, PersistedPassword } from './PasswordAuth';
import { Token, ApiGatewayAuthorizerTokenEvent } from './Auth';
import ObjectStore from '../objectStore/ObjectStore';
export default class JwtAuth implements PasswordAuth {
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
    verifyAuthorizationHeaderValue(value: string | undefined, scopes: string[]): Promise<string>;
    revokeTokenForId(token: Token, id: string): Promise<void>;
    authHandler(event: ApiGatewayAuthorizerTokenEvent, scopes: string[]): Promise<IamPolicyForPrincipal>;
    private generateIamPolicy;
}
