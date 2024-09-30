export type Action<T extends string = string, F extends number = number, P extends any[] = any[]> = {
    type: T;
    freq?: F;
    payload?: P
}

export interface CreateAction<A extends string, F extends number, P extends any[]> {
    type: A;
    freq?: F;
    payload?: P;
}

export interface CreateActionMapObject<A extends string, F extends number, P extends any[] = any[]> {
    [key: string]: CreateAction<A, F, P>;
}