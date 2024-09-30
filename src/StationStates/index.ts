import { AsyncState } from '../types/state';
import { StationStatesManager } from './setStationStates';

export class StationStates extends StationStatesManager {
    private stateMap: Map<string, AsyncState>;

    constructor() {
        super();
        this.stateMap = new Map();
    }

    addState(key: string, value: AsyncState): void {
        if (this.stateMap.has(key)) {
            throw new Error(`State with key "${key}" already exists.`);
        }
        this.stateMap.set(key, value);
    }

    async getState(key: string): Promise<AsyncState> {
        const state = this.stateMap.get(key);
        if (state instanceof Promise) {
            return await state;
        }
        return state;
    }

    getAllStates(): Map<string, AsyncState> {
        return this.stateMap;
    }
}