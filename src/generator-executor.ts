import { pass } from '@blackglory/prelude'
import { goGenerator } from '@blackglory/go'

export type ICallback<Yield, Next, Args extends unknown[]> = (...args: Args) =>
| void
| Generator<Yield, void, Next>

export abstract class GeneratorExecutor<Yield, Next, Args extends unknown[]> {
  protected callbacks: Array<ICallback<Yield, Next, Args>> = []

  abstract defer(callback: ICallback<Yield, Next, Args>): void

  get size(): number {
    return this.callbacks.length
  }

  remove(callback: ICallback<Yield, Next, Args>): void {
    this.callbacks = this.callbacks.filter(x => x !== callback)
  }

  * execute(...args: Args): Generator<Yield, void, Next> {
    const callbacks = this.callbacks
    this.callbacks = []

    for (const callback of callbacks) {
      yield* goGenerator(() => callback(...args))
    }
  }

  * executeSettled(...args: Args): Generator<Yield, void, Next> {
    const callbacks = this.callbacks
    this.callbacks = []

    for (const callback of callbacks) {
      try {
        yield* goGenerator(() => callback(...args))
      } catch {
        pass()
      }
    }
  }
}
