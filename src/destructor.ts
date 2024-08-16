import { Executor } from './executor.js'
import { Awaitable } from '@blackglory/prelude'
import { reverse } from 'extra-generator'

export class Destructor<Args extends unknown[] = []> extends Executor<Args> {
  protected iterate(callbacks: Array<(...args: Args) => Awaitable<unknown>>) {
    return reverse(callbacks)
  }
}
