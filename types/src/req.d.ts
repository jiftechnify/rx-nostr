import { Observable, type OperatorFunction } from "rxjs";
import { LazyFilter, ReqPacket } from "./packet.js";
import type { Override } from "./util.js";
/**
 * The RxReq interface that is provided for RxNostr (**not for users**).
 */
export interface RxReq<S extends RxReqStrategy = RxReqStrategy> {
    /** @internal User should not use this directly.The RxReq strategy. It is read-only and must not change. */
    get strategy(): S;
    /** @internal User should not use this directly. Used to construct subId. */
    get rxReqId(): string;
    /** @internal User should not use this directly. Get an Observable of ReqPacket. */
    getReqObservable(): Observable<ReqPacket>;
}
/**
 * REQ strategy.
 *
 * See comments on `createRxForwardReq()`, `createRxBackwardReq()` and `createRxOneshotReq()
 */
export type RxReqStrategy = "forward" | "backward" | "oneshot";
/**
 * The RxReq interface that is provided for users (not for RxNostr).
 */
export interface RxReqController {
    /** Start new REQ or stop REQ on the RxNostr with witch the RxReq is associated. */
    emit(filters: LazyFilter | LazyFilter[] | null): void;
    /**
     * Returns itself overriding only `getReqObservable()`.
     * It is useful for throttling and other control purposes.
     */
    pipe(): RxReq;
    pipe(op1: OperatorFunction<ReqPacket, ReqPacket>): RxReq;
    pipe<A>(op1: OperatorFunction<ReqPacket, A>, op2: OperatorFunction<A, ReqPacket>): RxReq;
    pipe<A, B>(op1: OperatorFunction<ReqPacket, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, ReqPacket>): RxReq;
    pipe<A, B, C>(op1: OperatorFunction<ReqPacket, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, ReqPacket>): RxReq;
    pipe<A, B, C, D>(op1: OperatorFunction<ReqPacket, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, ReqPacket>): RxReq;
}
/**
 * Create a RxReq instance based on the backward strategy.
 * It is useful if you want to retrieve past events that have already been published.
 *
 * In backward strategy:
 * - All REQs have different subIds.
 * - All REQ-subscriptions keep alive until timeout or getting EOSE.
 * - In most cases, you should specify `until` or `limit` for filters.
 *
 * For more information, see [document](https://penpenpng.github.io/rx-nostr/docs/req-strategy.html#backward-strategy).
 */
export declare function createRxBackwardReq(subIdBase?: string): RxReq<"backward"> & RxReqController;
/**
 * Create a RxReq instance based on the forward strategy.
 * It is useful if you want to listen future events.
 *
 * In forward strategy:
 * - All REQs have the same subId.
 * - When a new REQ is issued, the old REQ is overwritten and terminated immediately.
 *   The latest REQ keeps alive until it is overwritten or explicitly terminated.
 * - In most cases, you should not specify `limit` for filters.
 *
 * For more information, see [document](https://penpenpng.github.io/rx-nostr/docs/req-strategy.html#forward-strategy).
 */
export declare function createRxForwardReq(subId?: string): RxReq<"forward"> & RxReqController;
/**
 * Create a RxReq instance based on the oneshot strategy.
 * It is almost the same as backward strategy, however can publish only one REQ
 * and the Observable completes on EOSE.
 *
 * For more information, see [document](https://penpenpng.github.io/rx-nostr/docs/req-strategy.html#oneshot-strategy).
 */
export declare function createRxOneshotReq(req: {
    filters: LazyFilter | LazyFilter[];
    subId?: string;
}): RxReq<"oneshot">;
export interface Mixin<R, T> {
    (): ThisType<R> & T;
}
/** NOTE: unstable feature */
export declare function mixin<R extends object, T extends object>(def: () => ThisType<R> & T): Mixin<R, T>;
/** NOTE: unstable feature */
export declare function extend<B extends R, R extends object, T extends object>(base: B, mixin: Mixin<R, T>): Override<B, T>;
//# sourceMappingURL=req.d.ts.map