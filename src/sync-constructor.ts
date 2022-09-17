import { SyncExecutor } from './sync-executor'

export class SyncConstructor extends SyncExecutor {
  defer(callback: () => unknown): void {
    this.callbacks.push(callback)
  }
}
