export type Action = () => void;
export type Action1<TArg> = (arg: TArg) => void;
export type Action2<TArg1, TArg2> = (arg1: TArg1, arg2: TArg2) => void;
