import { each } from 'extra-promise'
import { Awaitable } from '@blackglory/prelude'

export abstract class Executor<Args extends unknown[]> {
  private autoClear: boolean
  private callbacks: Array<(...args: Args) => Awaitable<unknown>> = []

  constructor({ autoClear = true }: { autoClear?: boolean } = {}) {
    this.autoClear = autoClear
  }

  get size(): number {
    return this.callbacks.length
  }

  defer(callback: (...args: Args) => Awaitable<unknown>): void {
    this.callbacks.push(callback)
  }

  remove(callback: (...args: Args) => Awaitable<unknown>): void {
    this.callbacks = this.callbacks.filter(x => x !== callback)
  }

  clear(): void {
    this.callbacks = []
  }

  async execute(...args: Args): Promise<void> {
    await this.all(1, ...args)
  }

  async executeSettled(...args: Args): Promise<void> {
    await this.allSettled(1, ...args)
  }

  async all(concurrency: number = Infinity, ...args: Args): Promise<void> {
    const callbacks = this.callbacks

    if (this.autoClear) {
      this.clear()
    }

    await each(this.iterate(callbacks), callback => callback(...args), concurrency)
  }

  async allSettled(concurrency: number = Infinity, ...args: Args): Promise<void> {
    const callbacks = this.callbacks

    if (this.autoClear) {
      this.clear()
    }

    await each(this.iterate(callbacks), async callback => {
      try {
        await callback(...args)
      } catch {
        // pass
      }
    }, concurrency)
  }

  protected abstract iterate(
    callbacks: Array<(...args: Args) => Awaitable<unknown>>
  ): Iterable<(...args: Args) => Awaitable<unknown>>
}
