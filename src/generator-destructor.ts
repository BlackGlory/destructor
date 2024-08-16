import { GeneratorExecutor, ICallback } from './generator-executor.js'
import { reverse } from 'extra-generator'

export class GeneratorDestructor<
  Yield = unknown
, Next = unknown
, Args extends unknown[] = []
> extends GeneratorExecutor<Yield, Next, Args> {
  protected iterate(callbacks: Array<ICallback<Yield, Next, Args>>) {
    return reverse(callbacks)
  }
}
