import { each } from 'extra-promise'
import { pass, Awaitable } from '@blackglory/prelude'

export abstract class Executor<Args extends unknown[]> {
  protected callbacks: Array<(...args: Args) => Awaitable<unknown>> = []

  abstract defer(callback: (...args: Args) => Awaitable<unknown>): void

  get size(): number {
    return this.callbacks.length
  }

  remove(callback: (...args: Args) => Awaitable<unknown>): void {
    this.callbacks = this.callbacks.filter(x => x !== callback)
  }

  async execute(...args: Args): Promise<void> {
    await this.all(1, ...args)
  }

  async executeSettled(...args: Args): Promise<void> {
    await this.allSettled(1, ...args)
  }

  async all(concurrency: number = Infinity, ...args: Args): Promise<void> {
    const callbacks = this.callbacks
    this.callbacks = []
    await each(callbacks, callback => callback(...args), concurrency)
  }

  async allSettled(concurrency: number = Infinity, ...args: Args): Promise<void> {
    const callbacks = this.callbacks
    this.callbacks = []
    await each(callbacks, async callback => {
      try {
        await callback(...args)
      } catch {
        pass()
      }
    }, concurrency)
  }
}
