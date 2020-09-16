import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ObjectStore, Token, HttpError } from '../index';

import HasuraUserApi, { HasuraUserBase } from './HasuraUserApi';

export interface HasuraPersistedPassword {
  id: string;
  salt: string;
  hash: string;
  userId: string;
  iterations: number;
}

export default class JwtHasuraAuth<T extends HasuraUserBase> {
  private readonly hashLength = 256;
  private readonly digest = 'sha256';
  private readonly saltLength = 64;
  private readonly iterations = 10000;
  private readonly passwordStore: ObjectStore<HasuraPersistedPassword>;
  private readonly api: HasuraUserApi<T>;
  private readonly minPasswordLength: number;
  readonly timeToLive: number;
  readonly revokable: boolean;
  readonly jwtKey: string;
  readonly jwtDataCreator: (user: T) => { [key: string]: any };

  constructor(
    store: ObjectStore<HasuraPersistedPassword>,
    api: HasuraUserApi<T>,
    jwtKey: string,
    jwtDataCreator: (user: T) => { [key: string]: any },
    minPasswordLength: number = 10
  ) {
    this.passwordStore = store;
    this.timeToLive = -1;
    this.revokable = false;
    this.jwtKey = jwtKey;
    this.jwtDataCreator = jwtDataCreator;
    this.api = api;
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

  async createToken(user: T): Promise<Token> {
    const jwtData = this.jwtDataCreator(user);
    const options = this.timeToLive > 0 ? { expiresIn: this.timeToLive } : undefined;
    return jwt.sign(jwtData, this.jwtKey, options);
  }

  async addPassword(email: string, password: string): Promise<{ token: Token; user: T }> {
    if (await this.passwordStore.get(email)) {
      return Promise.reject(new HttpError(401, 'email already exists'));
    }
    if (password.length < this.minPasswordLength) {
      return Promise.reject(new HttpError(401, `password must be ${this.minPasswordLength} or more characters long`));
    }

    const user = await this.api.createUserWithEmail(email);
    const persistedPassword = await this.generatePersistedPassword(user.email, user.id, password);
    await this.passwordStore.put(email, persistedPassword);

    const token = await this.createToken(user);
    return { token, user };
  }

  async verifyPassword(email: string, password: string): Promise<{ token: Token; user: T }> {
    const persistedPassword = await this.passwordStore.get(email);
    if (!persistedPassword) {
      return Promise.reject(new HttpError(400, 'incorrect id or password'));
    }

    const validPassword = await this.verifyPersistedPassword(persistedPassword, password);
    if (!validPassword) {
      return Promise.reject(new HttpError(400, 'incorrect id or password'));
    }

    const user = await this.api.getUserById(persistedPassword.userId);
    const token = await this.createToken(user);
    return { token, user };
  }
}
