import { Executor } from './executor.js'
import { Awaitable } from '@blackglory/prelude'

export class Constructor<Args extends unknown[] = []> extends Executor<Args> {
  defer(callback: (...args: Args) => Awaitable<unknown>): void {
    this.callbacks.push(callback)
  }
}
