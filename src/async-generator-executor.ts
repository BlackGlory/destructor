import { pass } from '@blackglory/prelude'
import { goAsyncGenerator } from '@blackglory/go'

export type ICallback<Yield, Next> = () =>
| void
| Generator<Yield, void, Next>
| AsyncGenerator<Yield, void, Next>

export abstract class AsyncGeneratorExecutor<Yield = unknown, Next = unknown> {
  protected callbacks: Array<ICallback<Yield, Next>> = []

  abstract defer(callback: ICallback<Yield, Next>): void

  get size(): number {
    return this.callbacks.length
  }

  remove(callback: ICallback<Yield, Next>): void {
    this.callbacks = this.callbacks.filter(x => x !== callback)
  }

  async * execute(): AsyncGenerator<Yield, void, Next> {
    const callbacks = this.callbacks
    this.callbacks = []

    for (const callback of callbacks) {
      yield* goAsyncGenerator(callback)
    }
  }

  async * executeSettled(): AsyncGenerator<Yield, void, Next> {
    const callbacks = this.callbacks
    this.callbacks = []

    for (const callback of callbacks) {
      try {
        yield* goAsyncGenerator(callback)
      } catch {
        pass()
      }
    }
  }
}
