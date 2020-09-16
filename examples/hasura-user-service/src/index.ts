import 'source-map-support/register';
import fetch from 'node-fetch';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import {
  ApiGatewayExpress,
  getEnvVar,
  log,
  DynamoDbObjectStore,
  JwtHasuraAuth,
  HasuraAuthRouter,
  HasuraPersistedPassword
} from 'aws-serverless-toolbox';

import EventRouter from './EventRouter';
import UserApi, { jwtDataCreatorForUser, User } from './UserApi';

const region = getEnvVar('REGION');
const jwtKey = getEnvVar('JWT_KEY');
const jwtClaimsNamespace = getEnvVar('JWT_CLAIMS_NAMESPACE');
const hasuraUrl = getEnvVar('HASURA_URL');
const hasuraAdminSecret = getEnvVar('HASURA_ADMIN_SECRET');
const passwordTable = getEnvVar('PASSWORD_TABLE');

const passwordStore = new DynamoDbObjectStore<HasuraPersistedPassword>(passwordTable, region);
const api = new UserApi(hasuraUrl, hasuraAdminSecret);
const auth = new JwtHasuraAuth<User>(passwordStore, api, jwtKey, jwtDataCreatorForUser(jwtClaimsNamespace));

const authRouter = new HasuraAuthRouter(auth);
const apiGatewayExpressAuth = new ApiGatewayExpress({ '(/dev)?/auth/': authRouter.router });

const eventRouter = new EventRouter(passwordStore);
const apiGatewayExpressEvent = new ApiGatewayExpress({ '(/dev)?/event/': eventRouter.router });

export function authHandler(event: APIGatewayProxyEvent, context: Context) {
  log.logApiGatewayEvent(event, { onlyWhenDebug: true });
  apiGatewayExpressAuth.handler(event, context);
}

export function eventHandler(event: APIGatewayProxyEvent, context: Context) {
  log.logApiGatewayEvent(event, { onlyWhenDebug: true });
  apiGatewayExpressEvent.handler(event, context);
}
