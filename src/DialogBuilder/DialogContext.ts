export type DialogContext<TState, TScreenId = string> = TState & {
    $currentScreen: TScreenId;
    $previousScreen: TScreenId;
};
