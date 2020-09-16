import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ObjectStore, Token, HttpError } from '../index';

import HasuraUserApi, { HasuraUserApiUser } from './HasuraUserApi';

export interface HasuraPersistedPassword {
  id: string;
  salt: string;
  hash: string;
  userId: string;
  iterations: number;
}

export default class JwtHasuraAuth {
  private readonly hashLength = 256;
  private readonly digest = 'sha256';
  private readonly saltLength = 64;
  private readonly iterations = 10000;
  private readonly passwordStore: ObjectStore<HasuraPersistedPassword>;
  private readonly api: HasuraUserApi;
  private readonly minPasswordLength: number;
  readonly timeToLive: number;
  readonly revokable: boolean;
  readonly jwtKey: string;
  readonly jwtClaimsKey: string;
  readonly jwtAllowedRoles: string[];
  readonly jwtDefaultRole: string;

  constructor(
    store: ObjectStore<HasuraPersistedPassword>,
    jwtKey: string,
    jwtClaimsKey: string,
    api: HasuraUserApi,
    jwtAllowedRoles: string[] = ['user', 'admin'],
    jwtDefaultRole: string = 'user',
    minPasswordLength: number = 10
  ) {
    this.passwordStore = store;
    this.timeToLive = -1;
    this.revokable = false;
    this.jwtKey = jwtKey;
    this.jwtClaimsKey = jwtClaimsKey;
    this.api = api;
    this.jwtAllowedRoles = jwtAllowedRoles;
    this.jwtDefaultRole = jwtDefaultRole;
    this.minPasswordLength = minPasswordLength;
  }

  async generatePersistedPassword(id: string, userId: string, password: string): Promise<HasuraPersistedPassword> {
    return new Promise<HasuraPersistedPassword>((resolve, reject) => {
      const salt = crypto.randomBytes(this.saltLength).toString('base64');
      crypto.pbkdf2(password, salt, this.iterations, this.hashLength, this.digest, (error, hash) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            id,
            salt,
            userId,
            iterations: this.iterations,
            hash: hash.toString('base64')
          });
        }
      });
    });
  }

  private async verifyPersistedPassword(persistedPassword: HasuraPersistedPassword, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      crypto.pbkdf2(
        password,
        persistedPassword.salt,
        persistedPassword.iterations,
        this.hashLength,
        this.digest,
        (error, hash) => {
          if (error) {
            reject(error);
          } else {
            resolve(persistedPassword.hash === hash.toString('base64'));
          }
        }
      );
    });
  }

  async createToken(user: HasuraUserApiUser): Promise<Token> {
    const jwtData = {
      sub: user.id,
      email: user.email,
      iat: Date.now() / 1000,
      [this.jwtClaimsKey]: {
        'x-hasura-allowed-roles': this.jwtAllowedRoles,
        'x-hasura-default-role': this.jwtDefaultRole,
        'x-hasura-user-id': user.id
      }
    };

    const options = this.timeToLive > 0 ? { expiresIn: this.timeToLive } : undefined;
    return jwt.sign(jwtData, this.jwtKey, options);
  }

  async addPassword(email: string, password: string): Promise<{ token: Token; user: HasuraUserApiUser }> {
    if (await this.passwordStore.get(email)) {
      return Promise.reject(new HttpError(401, 'email already exists'));
    }
    if (password.length < this.minPasswordLength) {
      return Promise.reject(new HttpError(401, `password must be ${this.minPasswordLength} or more characters long`));
    }

    const user = await this.api.createUser(email);
    const persistedPassword = await this.generatePersistedPassword(user.email, user.id, password);
    await this.passwordStore.put(email, persistedPassword);

    const token = await this.createToken(user);
    return { token, user };
  }

  async verifyPassword(email: string, password: string): Promise<{ token: Token; user: HasuraUserApiUser }> {
    const persistedPassword = await this.passwordStore.get(email);
    if (!persistedPassword) {
      return Promise.reject(new HttpError(400, 'incorrect id or password'));
    }

    const validPassword = await this.verifyPersistedPassword(persistedPassword, password);
    if (!validPassword) {
      return Promise.reject(new HttpError(400, 'incorrect id or password'));
    }

    const user = await this.api.getUser(persistedPassword.userId);
    const token = await this.createToken(user);
    return { token, user };
  }
}
