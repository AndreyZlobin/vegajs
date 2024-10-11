import { signal } from '../external';

export class DataStorage<Data = unknown> {
  readonly #data = signal<Data | undefined>(undefined);

  public get data() {
    return this.#data;
  }

  public set(data?: Data) {
    this.#data.value = data;
  }

  public clear() {
    this.#data.value = undefined;
  }
}
