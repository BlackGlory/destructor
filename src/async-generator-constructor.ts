import { AsyncGeneratorExecutor, ICallback } from './async-generator-executor.js'

export class AsyncGeneratorConstructor<Yield = unknown, Next = unknown> extends AsyncGeneratorExecutor<Yield, Next> {
  defer(callback: ICallback<Yield, Next>): void {
    this.callbacks.push(callback)
  }
}
