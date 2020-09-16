import { Router, NextFunction, Request, Response } from 'express';
import { HttpError } from '../index';
import { HasuraUserBase } from './HasuraUserApi';
import JwtHasuraAuth from './JwtHasuraAuth';

// HTML Standard: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export default class AuthRouter<T extends HasuraUserBase> {
  readonly auth: JwtHasuraAuth<T>;
  readonly router = Router();

  constructor(auth: JwtHasuraAuth<T>) {
    this.auth = auth;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.use((request: Request, response: Response, next: NextFunction) => {
      response.header('Access-Control-Allow-Origin', '*');
      next();
    });
    this.router.post('/login', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { email, password } = request.body;
        if (!email || !password) {
          throw new HttpError(400, 'email and password required as body params');
        }
        const validEmail = String(email).toLowerCase();
        const result = await this.auth.verifyPassword(validEmail, password);
        response.json(result);
      } catch (error) {
        next(error);
      }
    });
    this.router.post('/register', async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { email, password } = request.body;
        if (!email || !password) {
          throw new HttpError(400, 'email and password required as body params');
        } else if (!emailRegex.test(email)) {
          throw new HttpError(400, 'invalid email');
        }
        const validEmail = String(email).toLowerCase();
        const result = await this.auth.addPassword(validEmail, password);
        response.json(result);
      } catch (error) {
        next(error);
      }
    });
  }
}
