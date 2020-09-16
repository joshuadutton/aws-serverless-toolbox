import fetch from 'node-fetch';
import { HasuraApi, HasuraUserApi, HasuraUserBase } from 'aws-serverless-toolbox';

export interface User extends HasuraUserBase {
  id: string;
  email: string;
  role: string;
}

export const jwtDataCreatorForUser = (jwtClaimsNamespace: string) => {
  return (user: User): { [key: string]: any } => {
    return {
      sub: user.id,
      email: user.email,
      iat: Date.now() / 1000,
      [jwtClaimsNamespace]: {
        'x-hasura-allowed-roles': ['admin', 'user'],
        'x-hasura-default-role': user.role,
        'x-hasura-user-id': user.id
      }
    };
  };
};

export default class UserApi implements HasuraUserApi<User> {
  private readonly hasuraApi: HasuraApi;
  constructor(url: string, token: string) {
    this.hasuraApi = new HasuraApi(fetch, url, token, true);
  }

  async createUserWithEmail(email: string): Promise<User> {
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
  async getUserById(id: string): Promise<User> {
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
