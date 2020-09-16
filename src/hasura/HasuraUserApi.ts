import { HasuraApi } from './HasuraLib';

export interface HasuraUserApiUser {
  id: string;
  email: string;
  role: string;
}

export default class HasuraUserApi {
  private readonly hasuraApi: HasuraApi;
  constructor(url: string, token: string, fetch: any) {
    this.hasuraApi = new HasuraApi(fetch, url, token, true);
  }

  async createUser(email: string): Promise<HasuraUserApiUser> {
    const mutation = `mutation createUser($email: String) {
      insert_users_one(object: {email: $email}) {
        id
        email
        role
      }
    }`;
    const payload = { query: mutation, variables: { email } };

    return this.hasuraApi.executeHasuraQuery(payload, 'insert_users_one');
  }

  async getUser(id: string): Promise<HasuraUserApiUser> {
    const query = `query getUser($id: uuid!) {
      users_by_pk(id:$id) {
        id
        email
        role
      }
    }`;
    const payload = { query, variables: { id } };

    return this.hasuraApi.executeHasuraQuery(payload, 'users_by_pk');
  }
}
