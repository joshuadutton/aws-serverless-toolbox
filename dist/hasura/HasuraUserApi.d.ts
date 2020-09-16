export interface HasuraUserBase {
    id: string;
    email: string;
}
export default interface HasuraUserApi<T extends HasuraUserBase> {
    createUserWithEmail(email: string): Promise<T>;
    getUserById(id: string): Promise<T>;
}
