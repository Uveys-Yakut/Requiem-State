import { Action } from '../types/action'
import { ActionCreator } from "../RequiemActions/requiemActCreator";

export class ActionStore {
    private actions: Action[] = [];
    private actionCreator: ActionCreator

    constructor() {
        this.actionCreator = new ActionCreator();
    }

    createAndAddAction<A extends string, F extends number, P extends any[] = any[]>(actionType: A, actionFreq: F, actionPayload?: P): void {
        const newAction = this.actionCreator.createAction(actionType, actionFreq, actionPayload);
        this.actions.push(newAction);
    }

    createAndAddActionsFromMap<A extends string, F extends number, P extends any[] = any[]>(
        actionMap: { [key: string]: { type: A; freq: F, payload?: P } }
    ): void {
        const newActionsMap = this.actionCreator.createActionsFromMap(actionMap);

        Object.values(newActionsMap).forEach(action => {
            this.actions.push(action as Action);
        });
    }

    getActions(): Action[] {
        return this.actions;
    }

    getActionByType(type: string): Action | undefined {
        return this.actions.find(action => action.type === type);
    }
}
