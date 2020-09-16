export interface HasuraUserApiUser {
    id: string;
    email: string;
    role: string;
}
export default class HasuraUserApi {
    private readonly hasuraApi;
    constructor(url: string, token: string, fetch: any);
    createUser(email: string): Promise<HasuraUserApiUser>;
    getUser(id: string): Promise<HasuraUserApiUser>;
}
