import { SyncExecutor } from './sync-executor.js'

export class SyncConstructor extends SyncExecutor {
  defer(callback: () => unknown): void {
    this.callbacks.push(callback)
  }
}
