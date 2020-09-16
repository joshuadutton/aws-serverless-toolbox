// TODO: try apollo-link-batch-http
export type HasuraEventOperation = 'INSERT' | 'UPDATE' | 'DELETE';

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

export class HttpError extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export interface HasuraGraphQLPayload {
  query: string;
  variables?: { [key: string]: any };
}

function throwKeyNotFoundError(key: string) {
  throw new Error(`key not found: ${key}`);
}

export function validateHasuraTriggerPayload(payload: HasuraTriggerPayload) {
  if (!payload.event) throwKeyNotFoundError('event');
  if (!payload.event.op) throwKeyNotFoundError('event.op');
  if (!payload.event.data) throwKeyNotFoundError('event.data');
  if (!payload.trigger?.name) throwKeyNotFoundError('trigger.name');
  if (!payload.table?.schema) throwKeyNotFoundError('table.schema');
  if (!payload.table?.name) throwKeyNotFoundError('table.name');
}

export function hasuraPayloadMatches(
  payload: HasuraTriggerPayload,
  op: HasuraEventOperation,
  schema: string,
  name: string
): boolean {
  return payload.event.op === op && payload.table.schema === schema && payload.table.name === name;
}

export class HasuraApi {
  private readonly fetch: any;
  private readonly url: string;
  private readonly token: string;
  private readonly isAdmin: boolean;

  constructor(fetch: any, url: string, token: string, isAdmin: boolean = false) {
    this.fetch = fetch;
    this.url = url;
    this.token = token;
    this.isAdmin = isAdmin;
  }

  async hasuraRequest(payload: HasuraGraphQLPayload): Promise<any> {
    const headers: any = {
      'Content-Type': 'application/json'
    };
    if (this.isAdmin) {
      headers['X-Hasura-Admin-Secret'] = this.token;
    } else {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return this.fetch(this.url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });
  }

  async executeHasuraQuery(payload: HasuraGraphQLPayload, key: string): Promise<any> {
    try {
      const response = await this.hasuraRequest(payload);
      const body = await response.json();
      if (body.errors) {
        console.log(JSON.stringify(payload, null, 2));
        return Promise.reject(new HttpError(400, body.errors.map((e: Error) => e.message).join(', ')));
      }

      const data = body.data[key];
      if (key.endsWith('_by_pk') && !data) {
        return Promise.reject(new HttpError(404, 'not found'));
      }

      return data;
    } catch (error) {
      console.log(JSON.stringify(payload, null, 2));
      return Promise.reject(new HttpError(500, error.message));
    }
  }
}
