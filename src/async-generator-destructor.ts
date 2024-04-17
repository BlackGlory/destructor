import { AsyncGeneratorExecutor, ICallback } from './async-generator-executor.js'

export class AsyncGeneratorDestructor<Yield = unknown, Next = unknown> extends AsyncGeneratorExecutor<Yield, Next> {
  defer(callback: ICallback<Yield, Next>): void {
    this.callbacks.unshift(callback)
  }
}
