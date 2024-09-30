export class StateMemoization {
    private cache: Map<string, any>;
    private limit: number;

    constructor(limit = 50) {
        this.cache = new Map();
        this.limit = limit;
    }

    private deepEqual(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) return true;

        if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
            return false;
        }

        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) return false;
            return obj1.every((val, index) => this.deepEqual(val, obj2[index]));
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (const key of keys1) {
            if (!this.deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }

    private deepClone<T>(obj: T): T {
        return Array.isArray(obj) ? [...obj] : JSON.parse(JSON.stringify(obj));
    }

    private generateHashKey(args: any[]): string {
        return JSON.stringify(args);
    }

    memoizeState<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => ReturnType<T> {
        return (...args: Parameters<T>): ReturnType<T> => {
            const key = this.generateHashKey(args);

            if (this.cache.has(key)) {
                const cachedResult = this.cache.get(key);

                if (this.deepEqual(cachedResult.state, args[0])) {
                    return cachedResult.result;
                }
            }

            const result = fn(...args);
            const stateClone = this.deepClone(args[0]);

            this.cacheResult(key, { state: stateClone, result });

            return result;
        };
    }

    private cacheResult(key: string, result: { state: any, result: any }): void {
        if (this.cache.size >= this.limit) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, result);
    }

    async memoizeAsyncState<T extends (...args: any[]) => any>(fn: T): Promise<(...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>> {
        return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
            const key = this.generateHashKey(args);

            if (this.cache.has(key)) {
                const cachedResult = this.cache.get(key);

                if (this.deepEqual(cachedResult.state, args[0])) {
                    return cachedResult.result;
                }
            }

            const result = await fn(...args);
            const stateClone = this.deepClone(args[0]);

            this.cacheResult(key, { state: stateClone, result });

            return result;
        };
    }

    clearCache(): void {
        this.cache.clear();
    }

    deleteCache(key: string): void {
        this.cache.delete(key);
    }
}
