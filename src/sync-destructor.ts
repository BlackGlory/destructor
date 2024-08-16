import { SyncExecutor } from './sync-executor.js'

export class SyncDestructor<Args extends unknown[] = []> extends SyncExecutor<Args> {
  defer(callback: (...args: Args) => unknown): void {
    this.callbacks.unshift(callback)
  }
}
