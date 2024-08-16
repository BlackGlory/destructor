import { AsyncGeneratorExecutor, ICallback } from './async-generator-executor.js'

export class AsyncGeneratorConstructor<
  Yield = unknown
, Next = unknown
, Args extends unknown[] = []
> extends AsyncGeneratorExecutor<Yield, Next, Args> {
  protected iterate(callbacks: Array<ICallback<Yield, Next, Args>>) {
    return callbacks
  }
}
