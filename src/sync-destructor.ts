import { SyncExecutor } from './sync-executor'

export class SyncDestructor extends SyncExecutor {
  defer(callback: () => unknown): void {
    this.callbacks.unshift(callback)
  }
}
