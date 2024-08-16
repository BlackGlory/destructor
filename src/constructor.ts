import { Executor } from './executor.js'
import { Awaitable } from '@blackglory/prelude'

export class Constructor<Args extends unknown[] = []> extends Executor<Args> {
  protected iterate(callbacks: Array<(...args: Args) => Awaitable<unknown>>) {
    return callbacks
  }
}
