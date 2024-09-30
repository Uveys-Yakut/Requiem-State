import { AsyncState } from './state'
import { StoreAction, StoreActionMapObject } from './store'

export interface BaseStationInput {
    storeName: string;
    state: AsyncState;
    storeAction?: StoreAction;
    storeActionMapObject?: StoreActionMapObject;
}
