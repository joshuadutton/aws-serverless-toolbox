import { Context } from 'aws-lambda';
import SubscriptionHandler from './SubscriptionHandler';
import { Auth } from '../auth/Auth';
import { ApiGatewayWebSocketEvent, ApiGatewayWebSocketResult } from './ApiGatewayWebSockets';
export default class ApiGatewayWebSocketSubscriptions {
  subscriptionHandler: SubscriptionHandler;
  auth: Auth;
  constructor(subscriptionHandler: SubscriptionHandler, auth: Auth);
  handler(event: ApiGatewayWebSocketEvent, context: Context): Promise<ApiGatewayWebSocketResult>;
}
