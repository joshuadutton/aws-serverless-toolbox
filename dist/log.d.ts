export declare function debug(...args: any): void;
export declare function info(...args: any): void;
export declare function error(...args: any): void;
export declare function accessLogMiddleware(req: any, res: any, next: any): Promise<void>;
export declare function logApiGatewayWebsocket(routeKey: string, endpoint: string, connectionId: string, message?: string): void;
export declare function logApiGatewayEvent(event: any, options?: {
    onlyWhenDebug: boolean;
}): void;
