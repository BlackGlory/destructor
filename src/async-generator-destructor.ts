import { AsyncGeneratorExecutor, ICallback } from './async-generator-executor.js'
import { reverse } from 'extra-generator'

export class AsyncGeneratorDestructor<
  Yield = unknown
, Next = unknown
, Args extends unknown[] = []
> extends AsyncGeneratorExecutor<Yield, Next, Args> {
  protected iterate(callbacks: Array<ICallback<Yield, Next, Args>>) {
    return reverse(callbacks)
  }
}
