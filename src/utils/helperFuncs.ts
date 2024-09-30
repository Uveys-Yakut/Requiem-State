import { StateObject, UpdateTypeDecision } from "../types/state";

export function checkSyncType(updates: StateObject): UpdateTypeDecision {
    for (const value of Object.values(updates)) {
        if (value instanceof Promise) {
            return 'async';
        }
    }
    return 'sync';
}
