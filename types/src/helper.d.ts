/** Return a function that is lazily evaluated for since/until parameters of `LazyFilter`. */
import Nostr from "nostr-typedef";
import { LazyFilter } from "./packet.js";
export declare function now(): number;
export declare function evalFilters(filters: LazyFilter | LazyFilter[]): Nostr.Filter[];
//# sourceMappingURL=helper.d.ts.map