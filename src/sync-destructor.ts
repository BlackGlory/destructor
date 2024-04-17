import { SyncExecutor } from './sync-executor.js'

export class SyncDestructor extends SyncExecutor {
  defer(callback: () => unknown): void {
    this.callbacks.unshift(callback)
  }
}
