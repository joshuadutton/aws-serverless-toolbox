import { ObjectStore, Token } from '../index';
import HasuraUserApi, { HasuraUserApiUser } from './HasuraUserApi';
export interface PersistedPassword {
    id: string;
    salt: string;
    hash: string;
    userId: string;
    iterations: number;
}
export default class JwtHasuraAuth {
    private readonly hashLength;
    private readonly digest;
    private readonly saltLength;
    private readonly iterations;
    private readonly passwordStore;
    private readonly api;
    private readonly minPasswordLength;
    readonly timeToLive: number;
    readonly revokable: boolean;
    readonly jwtKey: string;
    readonly jwtClaimsKey: string;
    readonly jwtAllowedRoles: string[];
    readonly jwtDefaultRole: string;
    constructor(store: ObjectStore<PersistedPassword>, jwtKey: string, jwtClaimsKey: string, api: HasuraUserApi, jwtAllowedRoles?: string[], jwtDefaultRole?: string, minPasswordLength?: number);
    generatePersistedPassword(id: string, userId: string, password: string): Promise<PersistedPassword>;
    private verifyPersistedPassword;
    createToken(user: HasuraUserApiUser): Promise<Token>;
    addPassword(email: string, password: string): Promise<{
        token: Token;
        user: HasuraUserApiUser;
    }>;
    verifyPassword(email: string, password: string): Promise<{
        token: Token;
        user: HasuraUserApiUser;
    }>;
}
