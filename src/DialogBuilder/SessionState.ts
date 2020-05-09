export type SessionState<TState, TScreenId> = {
    state: TState;
    $currentScreen: TScreenId;
};
