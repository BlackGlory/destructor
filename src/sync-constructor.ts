import { SyncExecutor } from './sync-executor.js'

export class SyncConstructor<Args extends unknown[] = []> extends SyncExecutor<Args> {
  protected iterate(callbacks: Array<(...args: Args) => unknown>) {
    return callbacks
  }
}
