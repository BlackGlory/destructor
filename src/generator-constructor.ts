import { GeneratorExecutor, ICallback } from './generator-executor.js'

export class GeneratorConstructor<
  Yield = unknown
, Next = unknown
, Args extends unknown[] = []
> extends GeneratorExecutor<Yield, Next, Args> {
  protected iterate(callbacks: Array<ICallback<Yield, Next, Args>>) {
    return callbacks
  }
}
