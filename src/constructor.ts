import { Executor } from './executor'

export class Constructor extends Executor {
  defer(callback: () => unknown | PromiseLike<unknown>): void {
    this.callbacks.push(callback)
  }
}
