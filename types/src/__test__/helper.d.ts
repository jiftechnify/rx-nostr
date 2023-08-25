import Nostr from "nostr-typedef";
import { type MonoTypeOperatorFunction } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { EventPacket, MessagePacket } from "../packet.js";
export declare function testScheduler(): TestScheduler;
export declare const faker: {
    eventPacket(packetOrEvent?: Partial<EventPacket["event"] & Omit<EventPacket, "event"> & {
        event?: Partial<EventPacket["event"]>;
    }>): EventPacket;
    messagePacket(message: Nostr.ToClientMessage.Any): MessagePacket;
    filter(filter?: Nostr.Filter | undefined): Nostr.Filter;
    filters(): Nostr.Filter[];
    event<const K extends number>(event?: Partial<Nostr.Event<K>> | undefined): Nostr.Event<K>;
    AUTH(event?: Partial<Nostr.Event<22242>> | undefined): Nostr.ToRelayMessage.AUTH;
    CLOSE(subId: string): Nostr.ToRelayMessage.CLOSE;
    COUNT(subId: string, filters?: Nostr.Filter[] | undefined): Nostr.ToRelayMessage.COUNT;
    EVENT(event?: Partial<Nostr.Event<number>> | undefined): Nostr.ToRelayMessage.EVENT;
    REQ(subId: string, filters?: Nostr.Filter[] | undefined): Nostr.ToRelayMessage.REQ;
    toClientMessage: {
        AUTH(message?: string | undefined): Nostr.ToClientMessage.AUTH;
        COUNT(subId: string, count?: number | undefined): Nostr.ToClientMessage.COUNT;
        EOSE(subId: string): Nostr.ToClientMessage.EOSE;
        EVENT(subId: string, event?: Partial<Nostr.Event<number>> | undefined): Nostr.ToClientMessage.EVENT;
        NOTICE(message?: string | undefined): Nostr.ToClientMessage.NOTICE;
        OK(eventId: string, succeeded: boolean, message?: string | undefined): Nostr.ToClientMessage.OK;
    };
};
export declare function spySub(): {
    completed: () => boolean;
    error: () => boolean;
    count: () => number;
    subscribed: () => boolean;
    unsubscribed: () => boolean;
    tap: <T>() => MonoTypeOperatorFunction<T>;
};
export declare function spyMessage(): {
    tap: () => MonoTypeOperatorFunction<MessagePacket>;
};
export declare function spyEvent(): {
    tap: () => MonoTypeOperatorFunction<EventPacket>;
};
//# sourceMappingURL=helper.d.ts.map