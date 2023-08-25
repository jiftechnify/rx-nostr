import Nostr from "nostr-typedef";
import { Observable } from "rxjs";
import { ConnectionState, LazyREQ, MessagePacket } from "./packet.js";
export declare class Connection {
    url: string;
    private config;
    private socket;
    private message$;
    private error$;
    private connectionState$;
    private connectionState;
    private queuedEvents;
    private reqs;
    private serverLimitations;
    private canRetry;
    get read(): boolean;
    set read(v: boolean);
    get write(): boolean;
    set write(v: boolean);
    get maxConcurrentReqs(): number | null;
    constructor(url: string, config: ConnectionConfig);
    private setConnectionState;
    private fetchServerLimitationsIfNeeded;
    start(): Promise<void>;
    stop(): void;
    getConnectionState(): ConnectionState;
    getMessageObservable(): Observable<MessagePacket>;
    getConnectionStateObservable(): Observable<ConnectionState>;
    getErrorObservable(): Observable<unknown>;
    ensureReq(req: LazyREQ, options?: {
        overwrite?: boolean;
    }): void;
    private ensureReqs;
    finalizeReq(subId: string): void;
    private finalizeAllReqs;
    sendEVENT(message: Nostr.ToRelayMessage.EVENT): void;
    dispose(): void;
}
export declare const WebSocketCloseCode: {
    /**
     * 1006 is a reserved value and MUST NOT be set as a status code in a
     * Close control frame by an endpoint.  It is designated for use in
     * applications expecting a status code to indicate that the
     * connection was closed abnormally, e.g., without sending or
     * receiving a Close control frame.
     *
     * See also: https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
     */
    readonly ABNORMAL_CLOSURE: 1006;
    /**
     * When a websocket is closed by the relay with a status code 4000
     * that means the client shouldn't try to connect again.
     *
     * See also: https://github.com/nostr-protocol/nips/blob/fab6a21a779460f696f11169ddf343b437327592/01.md?plain=1#L113
     */
    readonly DONT_RETRY: 4000;
    /** @internal rx-nostr uses it internally. */
    readonly DESIRED_BY_RX_NOSTR: 4537;
    /** @internal rx-nostr uses it internally. */
    readonly DISPOSED_BY_RX_NOSTR: 4538;
};
export interface ConnectionConfig {
    backoff: BackoffConfig;
    read: boolean;
    write: boolean;
    disableAutoFetchNip11Limitations?: boolean;
    maxConcurrentReqsFallback?: number;
}
export type BackoffConfig = {
    strategy: "exponential";
    maxCount: number;
    initialDelay: number;
} | {
    strategy: "linear";
    maxCount: number;
    interval: number;
} | {
    strategy: "immediately";
    maxCount: number;
} | {
    strategy: "off";
};
//# sourceMappingURL=connection.d.ts.map