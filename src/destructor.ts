import { Executor } from './executor.js'
import { Awaitable } from '@blackglory/prelude'

export class Destructor<Args extends unknown[] = []> extends Executor<Args> {
  defer(callback: (...args: Args) => Awaitable<unknown>): void {
    this.callbacks.unshift(callback)
  }
}
