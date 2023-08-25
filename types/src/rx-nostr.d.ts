import Nostr from "nostr-typedef";
import { type MonoTypeOperatorFunction, Observable } from "rxjs";
import { BackoffConfig } from "./connection.js";
import type { ConnectionState, ConnectionStatePacket, ErrorPacket, EventPacket, MessagePacket, OkPacket } from "./packet.js";
import type { RxReq } from "./req.js";
/**
 * The core object of rx-nostr, which holds a connection to relays
 * and manages subscriptions as directed by the RxReq object connected by `use()`.
 * Use `createRxNostr()` to get the object.
 */
export interface RxNostr {
    /**
     * Return a list of relays used by this object.
     * The relay URLs are normalised so may not match the URLs set.
     */
    getRelays(): RelayConfig[];
    /**
     * Set the list of relays.
     * If a REQ subscription already exists, the same REQ is issued for the newly added relay
     * and CLOSE is sent for the removed relay.
     */
    switchRelays(config: AcceptableRelaysConfig): Promise<void>;
    /** Utility wrapper for `switchRelays()`. */
    addRelay(relay: string | RelayConfig): Promise<void>;
    /** Utility wrapper for `switchRelays()`. */
    removeRelay(url: string): Promise<void>;
    /** Return true if the given relay is set to rxNostr. */
    hasRelay(url: string): boolean;
    /** Return true if the given relay allows to be written. */
    canWriteRelay(url: string): boolean;
    /** Return true if the given relay allows to be read. */
    canReadRelay(url: string): boolean;
    /** Fetch all relays' info based on [NIP-11](https://github.com/nostr-protocol/nips/blob/master/11.md) */
    fetchAllRelaysInfo(): Promise<Record<string, Nostr.Nip11.RelayInfo | null>>;
    /**
     * Return a dictionary in which you can look up connection state.
     *
     * **NOTE**: Keys are **normalized** URL, so may be different from one you set.
     */
    getAllRelayState(): Record<string, ConnectionState>;
    /**
     * Return connection state of the given relay.
     * Throw if unknown URL is given.
     */
    getRelayState(url: string): ConnectionState;
    /**
     * Attempt to reconnect the WebSocket if its state is `error` or `rejected`.
     * If not, do nothing.
     */
    reconnect(url: string): void;
    /**
     * Set or unset a pipe to be applied to all EventPackets.
     */
    setGlobalEventPacketPipe(pipe: MonoTypeOperatorFunction<EventPacket> | null): void;
    /**
     * Associate RxReq with RxNostr.
     * When the associated RxReq is manipulated,
     * the RxNostr issues a new REQ to all relays allowed to be read.
     * The method returns an Observable that issues EventPackets
     * when an EVENT is received that is subscribed by RxReq.
     * You can unsubscribe the Observable to CLOSE.
     */
    use(rxReq: RxReq, options?: Partial<RxNostrUseOptions>): Observable<EventPacket>;
    /**
     * Create an Observable that receives all events (EVENT) from all websocket connections.
     *
     * Nothing happens when this Observable is unsubscribed.
     * */
    createAllEventObservable(): Observable<EventPacket>;
    /**
     * Create an Observable that receives all errors from all websocket connections.
     * Note that an Observable is terminated when it receives any error,
     * so this method is the only way to receive errors arising from multiplexed websocket connections
     * (It means that Observables returned by `use()` never throw error).
     *
     * Nothing happens when this Observable is unsubscribed.
     * */
    createAllErrorObservable(): Observable<ErrorPacket>;
    /**
     * Create an Observable that receives all messages from all websocket connections.
     *
     * Nothing happens when this Observable is unsubscribed.
     * */
    createAllMessageObservable(): Observable<MessagePacket>;
    /**
     * Create an Observable that receives changing of WebSocket connection state.
     *
     * Nothing happens when this Observable is unsubscribed.
     */
    createConnectionStateObservable(): Observable<ConnectionStatePacket>;
    /**
     * Attempt to send events to all relays that are allowed to write.
     * The `seckey` option accepts both nsec format and hex format,
     * and if omitted NIP-07 will be automatically used.
     */
    send(params: Nostr.EventParameters, options?: RxNostrSendOptions): Observable<OkPacket>;
    /**
     * Release all resources held by the RxNostr object.
     * Any Observable resulting from this RxNostr will be in the completed state
     * and will never receive messages again.
     * RxReq used by this object is not affected; in other words, if the RxReq is used
     * by another RxNostr, its use is not prevented.
     */
    dispose(): void;
}
/** Create a RxNostr object. This is the only way to create that. */
export declare function createRxNostr(options?: Partial<RxNostrOptions>): RxNostr;
export interface RxNostrOptions {
    /** Auto reconnection strategy. */
    retry: BackoffConfig;
    /**
     * The time in milliseconds to timeout when following the backward strategy.
     * The observable is terminated when the specified amount of time has elapsed
     * during which no new events are available.
     */
    timeout: number;
    globalRelayConfig?: {
        disableAutoFetchNip11Limitations?: boolean;
        maxConcurrentReqsFallback?: number;
    };
}
export interface RxNostrUseOptions {
    scope?: string[];
}
export interface RxNostrSendOptions {
    scope?: string[];
    seckey?: string;
}
/** Config object specifying WebSocket behavior. */
export interface RelayConfig {
    /** WebSocket endpoint URL. */
    url: string;
    /** If true, rxNostr can publish REQ and subscribe EVENTs. */
    read: boolean;
    /** If true, rxNostr can send EVENTs. */
    write: boolean;
    disableAutoFetchNip11Limitations?: boolean;
}
/** Parameter of `rxNostr.switchRelays()` */
export type AcceptableRelaysConfig = (string | RelayConfig)[] | Nostr.Nip07.GetRelayResult;
//# sourceMappingURL=rx-nostr.d.ts.map