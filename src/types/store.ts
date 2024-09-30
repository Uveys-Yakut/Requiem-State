export interface StoreAction {
    type: string;
    freq: number;
    payload?: any | any[]; 
}

export interface StoreActionMapObject {
    [key: string]: StoreAction;
}