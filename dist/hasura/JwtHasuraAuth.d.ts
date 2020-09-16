import { ObjectStore, Token } from '../index';
import HasuraUserApi, { HasuraUserBase } from './HasuraUserApi';
export interface HasuraPersistedPassword {
    id: string;
    salt: string;
    hash: string;
    userId: string;
    iterations: number;
}
export default class JwtHasuraAuth<T extends HasuraUserBase> {
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
    readonly jwtDataCreator: (user: T) => {
        [key: string]: any;
    };
    constructor(store: ObjectStore<HasuraPersistedPassword>, api: HasuraUserApi<T>, jwtKey: string, jwtDataCreator: (user: T) => {
        [key: string]: any;
    }, minPasswordLength?: number);
    generatePersistedPassword(id: string, userId: string, password: string): Promise<HasuraPersistedPassword>;
    private verifyPersistedPassword;
    createToken(user: T): Promise<Token>;
    addPassword(email: string, password: string): Promise<{
        token: Token;
        user: T;
    }>;
    verifyPassword(email: string, password: string): Promise<{
        token: Token;
        user: T;
    }>;
}
