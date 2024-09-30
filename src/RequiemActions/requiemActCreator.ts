import { CreateAction, CreateActionMapObject } from '../types/action';

export class ActionCreator {
    createAction<A extends string, F extends number, P extends any[] = any[]>(actionType: A, actionFreq: F, actionPayload?: P): CreateAction<A, F, P> {
        const newAction: CreateAction<A, F, P> = {
            type: actionType,
            freq: actionFreq,
            payload: actionPayload
        };

        return newAction;
    }
    
    createActionsFromMap<A extends string, F extends number, P extends any[] = any[]>(
        actionMap: { [key: string]: { type: A; freq: F, payload?: P } }
    ): CreateActionMapObject<A, F, P> {
        const actions: CreateActionMapObject<A, F, P> = {};

        for (const key in actionMap) {
            if (actionMap.hasOwnProperty(key)) {
                const { type, freq, payload } = actionMap[key];
                actions[key] = this.createAction(type, freq, payload);
            }
        }

        return actions;
    }
}
