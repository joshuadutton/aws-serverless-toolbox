export declare type HasuraEventOperation = 'INSERT' | 'UPDATE' | 'DELETE';
export interface HasuraTriggerPayload {
    event: HasuraEvent;
    created_at: string;
    id: string;
    delivery_info: {
        max_retries: number;
        current_retry: number;
    };
    trigger: {
        name: string;
    };
    table: {
        schema: string;
        name: string;
    };
}
export interface HasuraEvent {
    session_variables: {
        [key: string]: string;
    };
    op: HasuraEventOperation;
    data: {
        old: any;
        new: any;
    };
}
export interface HasuraEventHandler {
    handleEvent(payload: HasuraTriggerPayload): Promise<void>;
}
export declare class HttpError extends Error {
    statusCode: number;
    message: string;
    constructor(statusCode: number, message: string);
}
export interface HasuraGraphQLPayload {
    query: string;
    variables?: {
        [key: string]: any;
    };
}
export declare function validateHasuraTriggerPayload(payload: HasuraTriggerPayload): void;
export declare function hasuraPayloadMatches(payload: HasuraTriggerPayload, op: HasuraEventOperation, schema: string, name: string): boolean;
export declare class HasuraApi {
    private readonly fetch;
    private readonly url;
    private readonly token;
    private readonly isAdmin;
    constructor(fetch: any, url: string, token: string, isAdmin?: boolean);
    hasuraRequest(payload: HasuraGraphQLPayload): Promise<any>;
    executeHasuraQuery(payload: HasuraGraphQLPayload, key: string): Promise<any>;
}
