import { SyncExecutor } from './sync-executor.js'

export class SyncDestructor<Args extends unknown[] = []> extends SyncExecutor<Args> {
  protected * iterate(callbacks: Array<(...args: Args) => unknown>) {
    for (let i = callbacks.length; i--;) {
      yield callbacks[i]
    }
  }
}
