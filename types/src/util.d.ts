export declare function defineDefaultOptions<T extends Record<string, any>>(defaultParams: T): (givenParams?: Partial<T>) => T;
export type Override<T extends object, U extends object> = {
    [K in keyof T | keyof U]: K extends keyof U ? U[K] : K extends keyof T ? T[K] : never;
};
export declare function normalizeRelayUrl(url: string): string;
//# sourceMappingURL=util.d.ts.map