import ObjectStore, { Action, Reducer } from './ObjectStore';
export default class S3ObjectStore<T> implements ObjectStore<T> {
  private readonly s3;
  private readonly bucketName;
  private readonly keyPrefix;
  constructor(bucketName: string, keyPrefix?: string);
  private s3KeyForId;
  get(id: string): Promise<T | undefined>;
  put(id: string, value: T): Promise<T>;
  delete(id: string): Promise<void>;
  updateState(id: string, action: Action, reducer: Reducer<T>): Promise<T>;
}
