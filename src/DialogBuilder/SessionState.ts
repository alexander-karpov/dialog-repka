export type SessionState<TState, TSceneId> = {
    state: TState;
    $currentScene: TSceneId;
};
