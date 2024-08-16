import { Executor } from './executor.js'
import { Awaitable } from '@blackglory/prelude'

export class Destructor<Args extends unknown[] = []> extends Executor<Args> {
  protected * iterate(callbacks: Array<(...args: Args) => Awaitable<unknown>>) {
    for (let i = callbacks.length; i--;) {
      yield callbacks[i]
    }
  }
}
