import { produce } from 'immer';
import { State, StateObject } from '../types/state';
import { checkSyncType } from '../utils/helperFuncs';

export class StationStatesManager {
    private isStateObject = (obj: any): obj is StateObject => {
        return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    };

    constructor() {}

    updateStateAutoType(state: State, updates: StateObject): Promise<State> | State {
        const updateType = checkSyncType(updates);
        
        if (updateType === 'async') {
            return this.asyncUpdateState(state, updates);
        } else {
            return this.updateState(state, updates);
        }
    }
    
    private updateState = (state: State, updates: StateObject): State => {
        return produce(state, draft => {
            for (const key in updates) {
                if (updates.hasOwnProperty(key)) {
                    const value = updates[key];
                    if (this.isStateObject(draft)) {
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            if (!draft[key]) {
                                draft[key] = {};
                            }
                            Object.assign(draft[key], value);
                        } else {
                            draft[key] = value;
                        }                        
                    }
                }
            }
        });
    };

    private asyncUpdateState = async (state: State, updates: StateObject): Promise<State> => {
        const result = await Promise.all(
            Object.entries(updates).map(async ([key, value]) => {
                if (value instanceof Promise) {
                    return [key, await value];
                } else {
                    return [key, value];
                }
            })
        );
    
        const resolvedUpdates: StateObject = Object.fromEntries(result);
        
        return produce(state, draft => {
            for (const key in resolvedUpdates) {
                if (resolvedUpdates.hasOwnProperty(key)) {
                    const value = resolvedUpdates[key];
                    if (this.isStateObject(draft)) {
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            if (!draft[key]) {
                                draft[key] = {};
                            }
                            Object.assign(draft[key], value);
                        } else {
                            draft[key] = value;
                        }                        
                    }
                }
            }
        });
    };
}