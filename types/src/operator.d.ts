import Nostr from "nostr-typedef";
import { type MonoTypeOperatorFunction, type ObservableInput, type OperatorFunction } from "rxjs";
import { MatchFilterOptions } from "./nostr/filter.js";
import { EventPacket, LazyFilter, MessagePacket, ReqPacket } from "./packet.js";
/**
 * Remove the events once seen.
 */
export declare function uniq(flushes?: ObservableInput<unknown>): MonoTypeOperatorFunction<EventPacket>;
/**
 * Create a customizable uniq operator.
 *
 * If `keyFn()` returns a non-null key, the key is stored in `Set`.
 * The operator filters packets with keys already stored.
 *
 * The `Set` returned in the second value of the tuple
 * can be manipulated externally or in optional event handlers.
 * For example, you can call `Set#clear()` to forget all keys.
 */
export declare function createUniq<T>(keyFn: (packet: EventPacket) => T | null, options?: CreateUniqOptions<T>): [MonoTypeOperatorFunction<EventPacket>, Set<T>];
/**
 * Only the latest events are allowed to pass.
 */
export declare function latest(): MonoTypeOperatorFunction<EventPacket>;
/**
 * For each key, only the latest events are allowed to pass.
 */
export declare function latestEach<K>(key: (packet: EventPacket) => K): MonoTypeOperatorFunction<EventPacket>;
/**
 * Only events with a valid signature are allowed to pass.
 */
export declare function verify(): MonoTypeOperatorFunction<EventPacket>;
/**
 * Only events with given kind are allowed to pass.
 */
export declare function filterKind<K extends number>(kind: K): MonoTypeOperatorFunction<EventPacket>;
/**
 * Filter events based on a REQ filter object.
 */
export declare function filterBy(filters: LazyFilter | LazyFilter[], options?: MatchFilterOptions & FilterByOptions): MonoTypeOperatorFunction<EventPacket>;
/**
 * Accumulate latest events in order of new arrival (based on `created_at`).
 */
export declare function timeline(limit?: number): OperatorFunction<EventPacket, EventPacket[]>;
export declare function sortEvents(bufferTime: number, compareFn?: (a: EventPacket, b: EventPacket) => number): MonoTypeOperatorFunction<EventPacket>;
export declare function filterType<T extends Nostr.ToClientMessage.Type>(type: T): OperatorFunction<MessagePacket, MessagePacket<Nostr.ToClientMessage.Message<T>>>;
/**
 * Map REQ packets into a single REQ packet.
 *
 * It is useful to reduce REQ requests in a time interval.
 */
export declare function batch(
/** Function used for merge REQ filters. Default behavior is simple concatenation. */
mergeFilter?: MergeFilter): OperatorFunction<ReqPacket[], ReqPacket>;
/**
 * Chunk a REQ packet into multiple REQ packets.
 *
 * It is useful to avoid to send large REQ filter.
 */
export declare function chunk(predicate: (f: LazyFilter[]) => boolean, toChunk: (f: LazyFilter[]) => LazyFilter[][]): MonoTypeOperatorFunction<ReqPacket>;
/**
 * Almost RxJS's `timeout`, but won't throw.
 */
export declare function completeOnTimeout<T>(time: number): MonoTypeOperatorFunction<T>;
/**
 * Buffer the received values for a specified time
 * and return the values in sorted order as possible.
 */
export declare function sort<T>(bufferTime: number, compareFn: (a: T, b: T) => number): MonoTypeOperatorFunction<T>;
export type MergeFilter = (a: LazyFilter[], b: LazyFilter[]) => LazyFilter[];
export interface CreateUniqOptions<T> {
    onCache?: (packet: EventPacket, cache: Set<T>) => void;
    onHit?: (packet: EventPacket, cache: Set<T>) => void;
}
export interface FilterByOptions {
    not: boolean;
}
//# sourceMappingURL=operator.d.ts.map