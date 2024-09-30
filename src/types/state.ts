export type Primitive = string | number | boolean | null | undefined;

export type State = Primitive | StateObject | StateArray;

export type AsyncState = Primitive | StateObject | StateArray | Promise<State>;

export interface StateObject {
    [key: string]: AsyncState;
}

export  interface StateArray extends Array<AsyncState> {}

export type UpdateTypeDecision = 'sync' | 'async';