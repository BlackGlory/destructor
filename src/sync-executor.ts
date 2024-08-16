import { pass } from '@blackglory/prelude'

export abstract class SyncExecutor<Args extends unknown[]> {
  protected callbacks: Array<(...args: Args) => unknown> = []

  abstract defer(callback: (...args: Args) => unknown): void

  get size(): number {
    return this.callbacks.length
  }

  remove(callback: (...args: Args) => unknown): void {
    this.callbacks = this.callbacks.filter(x => x !== callback)
  }

  execute(...args: Args): void {
    const callbacks = this.callbacks
    this.callbacks = []
    callbacks.forEach(callback => callback(...args))
  }

  executeSettled(...args: Args): void {
    const callbacks = this.callbacks
    this.callbacks = []
    callbacks.forEach(callback => {
      try {
        callback(...args)
      } catch {
        pass()
      }
    })
  }
}
