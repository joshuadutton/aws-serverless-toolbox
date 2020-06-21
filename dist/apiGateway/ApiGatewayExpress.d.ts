/// <reference types="node" />
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import express, { NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import HttpError from './HttpError';
export declare type RouterMap = {
  [path: string]: express.Router;
};
export default class ApiGatewayExpress {
  readonly app: import('express-serve-static-core').Express;
  readonly routerMap: RouterMap;
  readonly server: Server;
  constructor(routerMap: RouterMap);
  attachLogInfoMiddleware(request: any, response: Response, next: NextFunction): void;
  attachUserAuthMiddleware(request: any, response: Response, next: NextFunction): void;
  setupMiddlewareAndRoutes(): void;
  errorMiddleware(error: HttpError, request: Request, response: Response, next: NextFunction): void;
  notFoundMiddleware(request: Request, response: Response, next: NextFunction): void;
  handler(event: APIGatewayProxyEvent, context: Context): void;
}
