import { pass } from '@blackglory/prelude'
import { goGenerator } from '@blackglory/go'

export type ICallback<Yield, Next> = () =>
| void
| Generator<Yield, void, Next>

export abstract class GeneratorExecutor<Yield = unknown, Next = unknown> {
  protected callbacks: Array<ICallback<Yield, Next>> = []

  abstract defer(callback: ICallback<Yield, Next>): void

  get size(): number {
    return this.callbacks.length
  }

  remove(callback: ICallback<Yield, Next>): void {
    this.callbacks = this.callbacks.filter(x => x !== callback)
  }

  * execute(): Generator<Yield, void, Next> {
    const callbacks = this.callbacks
    this.callbacks = []

    for (const callback of callbacks) {
      yield* goGenerator(callback)
    }
  }

  * executeSettled(): Generator<Yield, void, Next> {
    const callbacks = this.callbacks
    this.callbacks = []

    for (const callback of callbacks) {
      try {
        yield* goGenerator(callback)
      } catch {
        pass()
      }
    }
  }
}
