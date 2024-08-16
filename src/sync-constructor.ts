import { SyncExecutor } from './sync-executor.js'

export class SyncConstructor<Args extends unknown[] = []> extends SyncExecutor<Args> {
  defer(callback: (...args: Args) => unknown): void {
    this.callbacks.push(callback)
  }
}
