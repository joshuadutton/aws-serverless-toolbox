# AWS Serverless Toolbox

This is still a work in progress. Some of the stuff works well, but documentation is currently lacking. I am actively changing things, so use at your own risk.

## Install notes:

- AWS SDK

## Object Stores

For the purpose of working with single objects. Supports `get`, `put`, and `delete`. Also supports custom reducers for updates.

#### Interface:

```TypeScript
export default interface ObjectStore<T> {
  get(id: string): Promise<T | undefined>;
  put(id: string, item: T): Promise<T>;
  delete(id: string): Promise<void>;
  updateState(id: string, action: Action, reducer: Reducer<T>): Promise<T>;
}
```

#### Store types

- S3
- DynamoDB

## API Gateway

#### Routing

#### WebSockets
