import { goAsyncGenerator } from '@blackglory/go'

export type ICallback<Yield, Next, Args extends unknown[]> = (...args: Args) =>
| void
| Generator<Yield, void, Next>
| AsyncGenerator<Yield, void, Next>

export abstract class AsyncGeneratorExecutor<Yield, Next, Args extends unknown[]> {
  private autoClear: boolean
  private callbacks: Array<ICallback<Yield, Next, Args>> = []

  constructor({ autoClear = true }: { autoClear?: boolean } = {}) {
    this.autoClear = autoClear
  }

  get size(): number {
    return this.callbacks.length
  }

  defer(callback: ICallback<Yield, Next, Args>): void {
    this.callbacks.push(callback)
  }

  remove(callback: ICallback<Yield, Next, Args>): void {
    this.callbacks = this.callbacks.filter(x => x !== callback)
  }

  clear(): void {
    this.callbacks = []
  }

  async * execute(...args: Args): AsyncGenerator<Yield, void, Next> {
    const callbacks = this.callbacks

    if (this.autoClear) {
      this.clear()
    }

    for (const callback of this.iterate(callbacks)) {
      yield* goAsyncGenerator(() => callback(...args))
    }
  }

  async * executeSettled(...args: Args): AsyncGenerator<Yield, void, Next> {
    const callbacks = this.callbacks

    if (this.autoClear) {
      this.clear()
    }

    for (const callback of this.iterate(callbacks)) {
      try {
        yield* goAsyncGenerator(() => callback(...args))
      } catch {
        // pass
      }
    }
  }

  protected abstract iterate(
    callbacks: Array<ICallback<Yield, Next, Args>>
  ): Iterable<ICallback<Yield, Next, Args>>
}
