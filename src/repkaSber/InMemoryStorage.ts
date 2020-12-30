export class InMemoryStorage<TData> {
    private readonly storage = new Map<string, TData>();

    find(id: string): Promise<TData | undefined> {
        return Promise.resolve(this.storage.get(id));
    }

    save(id: string, data: TData): Promise<void> {
        this.storage.set(id, data);

        return Promise.resolve();
    }
}
