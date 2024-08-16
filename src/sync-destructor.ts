import { SyncExecutor } from './sync-executor.js'
import { reverse } from 'extra-generator'

export class SyncDestructor<Args extends unknown[] = []> extends SyncExecutor<Args> {
  protected iterate(callbacks: Array<(...args: Args) => unknown>) {
    return reverse(callbacks)
  }
}
