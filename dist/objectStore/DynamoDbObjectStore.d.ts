import ObjectStore, { Action, Reducer } from './ObjectStore';
export default class DynamoObjectDBStore<T> implements ObjectStore<T> {
    private readonly db;
    private readonly tableName;
    private readonly timeToLiveSeconds?;
    private readonly expiresKey;
    constructor(tableName: string, region: string, timeToLiveSeconds?: number, expiresKey?: string);
    private createExpires;
    get(id: string): Promise<T | undefined>;
    put(id: string, item: T): Promise<T>;
    delete(id: string): Promise<void>;
    updateState(id: string, action: Action, reducer: Reducer<T>): Promise<T>;
}
