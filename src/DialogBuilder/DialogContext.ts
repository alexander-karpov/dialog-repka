export type DialogContext<TState, TScreenId> = {
    state: TState;
    $currentScreen: TScreenId;
};
