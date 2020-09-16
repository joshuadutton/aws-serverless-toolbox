import JwtHasuraAuth from './JwtHasuraAuth';
export default class AuthRouter {
    readonly auth: JwtHasuraAuth;
    readonly router: import("express-serve-static-core").Router;
    constructor(auth: JwtHasuraAuth);
    setupRoutes(): void;
}
