import { HasuraUserBase } from './HasuraUserApi';
import JwtHasuraAuth from './JwtHasuraAuth';
export default class AuthRouter<T extends HasuraUserBase> {
    readonly auth: JwtHasuraAuth<T>;
    readonly router: import("express-serve-static-core").Router;
    constructor(auth: JwtHasuraAuth<T>);
    setupRoutes(): void;
}
