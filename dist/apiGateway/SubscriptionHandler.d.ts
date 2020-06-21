import ObjectStore from '../objectStore/ObjectStore';
export declare type CacheObject = Subscription | SubscriberMap;
export declare enum SubscriberType {
  WebSocket = 'WebSocket',
  PushNotification = 'PushNotification'
}
export declare type Subscriber = WebSocketSubscriber | PushNotificationSubscriber;
export declare class WebSocketSubscriber {
  readonly type = SubscriberType.WebSocket;
  readonly id: string;
  readonly endpoint: string;
  constructor(id: string, endpoint: string);
}
export declare class PushNotificationSubscriber {
  readonly type = SubscriberType.PushNotification;
  readonly id: string;
  constructor(id: string);
}
export declare class Subscription {
  cacheName: string;
  toThingId: string;
  subscribers: Subscriber[];
  constructor(thingId: string);
}
export declare class SubscriberMap {
  cacheName: string;
  subscriberId: string;
  thingId: string;
  constructor(subscriberId: string, thingId: string);
}
export default class SubscriptionHandler {
  private readonly subscriptionStore;
  constructor(store: ObjectStore<CacheObject>);
  getSubscriptionForThing(id: string): Promise<Subscription | undefined>;
  getSubscriberMapForSubscriber(id: string): Promise<SubscriberMap | undefined>;
  subscribe(thingId: string, subscriber: Subscriber): Promise<void>;
  unsubscribe(subscriberId: string): Promise<void>;
  sendMessageToSubscribers(thingId: string, message: any): Promise<any>;
}
