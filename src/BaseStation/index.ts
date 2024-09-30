import { Action } from '../types/action';
import { BaseStationInput } from '../types/base-station';
import { ActionStore } from "../RequiemStore";
import { StationStates } from '../StationStates';
import { State, StateObject } from '../types/state';

export class BaseStation extends StationStates {
    private actionStores: { [key: string]: ActionStore } = {};

    constructor() {
        super();
    }

    create(inputs: BaseStationInput | BaseStationInput[], config: object = {}): void {
        const inputArray = Array.isArray(inputs) ? inputs : [inputs];
    
        inputArray.forEach(input => {
            const { storeName, state, storeAction, storeActionMapObject } = input;
    
            this.createActionStore(storeName);
            this.addState(storeName, state);
            const store = this.getActionStore(storeName);
    
            if (!storeAction && !storeActionMapObject) {
                throw new Error("At least one of storeAction or storeActionMapObject must be provided.");
            }
    
            if (storeAction) {
                store?.createAndAddAction(storeAction.type, storeAction.freq, storeAction.payload);
            }
    
            if (storeActionMapObject) {
                store?.createAndAddActionsFromMap(storeActionMapObject);
            }
        });
    }

    private createActionStore(storeName: string): void {
        if (this.actionStores[storeName]) {
            throw new Error(`ActionStore with name "${storeName}" already exists.`);
        }
        this.actionStores[storeName] = new ActionStore();
    }

    reflectDesiredAction(storeName: string, actionType: string, desiredAction?: (storeState: StateObject, payload?: any | any[]) => void) {
        const store = this.getActionStore(storeName);
        const storeState = this.getState(storeName);
        
        storeState.then(data => {
            const storeState = data;
            const payload = store?.getActionByType(actionType)?.payload;
    
            if (desiredAction) {
                desiredAction(storeState as StateObject, payload);
            }
        });
    }

    getActionStore(storeName: string): ActionStore | undefined {
        return this.actionStores[storeName];
    }

    getAllActionStores(): { [key: string]: ActionStore } {
        return this.actionStores;
    }

    getActionsFromStore(storeName: string): Action[] | undefined {
        const store = this.getActionStore(storeName);
        return store ? store.getActions() : undefined;
    }

    getActionFromStoreByType(storeName: string, type: string): Action | undefined {
        const store = this.getActionStore(storeName);
        return store ? store.getActionByType(type) : undefined;
    }
}