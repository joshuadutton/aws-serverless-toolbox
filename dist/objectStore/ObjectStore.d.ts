export default interface ObjectStore<T> {
  get(id: string): Promise<T | undefined>;
  put(id: string, item: T): Promise<T>;
  delete(id: string): Promise<void>;
  updateState(id: string, action: Action, reducer: Reducer<T>): Promise<T>;
}
export interface Action {
  type: string;
  payload?: {
    [key: string]: any;
  };
  meta?: {
    [key: string]: any;
  };
  error?: boolean;
}
export declare type Reducer<T> = (state: T, action: Action) => T;
export declare function actionHandler<T>(store: ObjectStore<T>, id: string, action: Action, reducer: Reducer<T>): Promise<T>;
export declare function getEnvVar(name: string): string;
