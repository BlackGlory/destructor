import { AsyncGeneratorExecutor, ICallback } from './async-generator-executor.js'

export class AsyncGeneratorDestructor<
  Yield = unknown
, Next = unknown
, Args extends unknown[] = []
> extends AsyncGeneratorExecutor<Yield, Next, Args> {
  protected * iterate(callbacks: Array<ICallback<Yield, Next, Args>>) {
    for (let i = callbacks.length; i--;) {
      yield callbacks[i]
    }
  }
}
