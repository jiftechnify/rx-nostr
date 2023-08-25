import * as Nostr from "nostr-typedef";
export interface MatchFilterOptions {
    sinceInclusive: boolean;
    untilInclusive: boolean;
}
/**
 * Return true if the given filter matches the given filters.
 */
export declare function isFiltered(event: Nostr.Event, filters: Nostr.Filter | Nostr.Filter[], options?: Partial<MatchFilterOptions>): boolean;
//# sourceMappingURL=filter.d.ts.map