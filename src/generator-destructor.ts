import { GeneratorExecutor, ICallback } from './generator-executor.js'

export class GeneratorDestructor<
  Yield = unknown
, Next = unknown
, Args extends unknown[] = []
> extends GeneratorExecutor<Yield, Next, Args> {
  protected * iterate(callbacks: Array<ICallback<Yield, Next, Args>>) {
    for (let i = callbacks.length; i--;) {
      yield callbacks[i]
    }
  }
}
