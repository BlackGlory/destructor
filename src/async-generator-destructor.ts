import { AsyncGeneratorExecutor, ICallback } from './async-generator-executor.js'

export class AsyncGeneratorDestructor<
  Yield = unknown
, Next = unknown
, Args extends unknown[] = []
> extends AsyncGeneratorExecutor<Yield, Next, Args> {
  defer(callback: ICallback<Yield, Next, Args>): void {
    this.callbacks.unshift(callback)
  }
}
