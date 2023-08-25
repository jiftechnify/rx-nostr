import Nostr from "nostr-typedef";
/**
 * Return a signed event that is ready for sending.
 */
export declare function getSignedEvent(params: Nostr.EventParameters, 
/** Private key in bech32 format of HEX format. If omitted, attempt to use NIP-07 interface. */
seckey?: string): Promise<Nostr.Event>;
/** Calculate and return public key in HEX format. */
export declare function getPublicKey(seckey: string): string;
/** Calculate and return event's hash (ID). */
export declare function getEventHash(event: Nostr.UnsignedEvent): string;
/** Calculate and return schnorr signature. */
export declare function getSignature(eventHash: string, seckey: string): string;
/** Verify the given event and return true if it is valid. */
export declare function verify(event: Nostr.Event): boolean;
/** Return an event that has earlier `created_at`. */
export declare function earlierEvent(a: Nostr.Event, b: Nostr.Event): Nostr.Event;
/** Return an event that has later `created_at`. */
export declare function laterEvent(a: Nostr.Event, b: Nostr.Event): Nostr.Event;
/** Sort key function to sort events based on `created_at`. */
export declare function compareEvents(a: Nostr.Event, b: Nostr.Event): number;
//# sourceMappingURL=event.d.ts.map