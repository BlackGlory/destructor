import { Executor } from './executor.js'
import { Awaitable } from '@blackglory/prelude'

export class Constructor extends Executor {
  defer(callback: () => Awaitable<unknown>): void {
    this.callbacks.push(callback)
  }
}
