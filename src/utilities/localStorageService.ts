import { Memento } from "vscode";

export class LocalStorageService {
  constructor(private storage: Memento) {
    storage.keys().forEach((key) => {
      storage.update(key, null);
    });
  }

  public getValue<T>(key: string): T | undefined {
    return this.storage.get<T | undefined>(key, undefined);
  }

  public setValue<T>(key: string, value: T) {
    this.storage.update(key, value);
  }
}
