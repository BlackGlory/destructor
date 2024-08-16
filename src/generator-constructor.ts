import { GeneratorExecutor, ICallback } from './generator-executor.js'

export class GeneratorConstructor<
  Yield = unknown
, Next = unknown
, Args extends unknown[] = []
> extends GeneratorExecutor<Yield, Next, Args> {
  defer(callback: ICallback<Yield, Next, Args>): void {
    this.callbacks.push(callback)
  }
}
