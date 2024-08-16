export abstract class SyncExecutor<Args extends unknown[]> {
  private autoClear: boolean
  private callbacks: Array<(...args: Args) => unknown> = []

  constructor({ autoClear = true }: { autoClear?: boolean } = {}) {
    this.autoClear = autoClear
  }

  get size(): number {
    return this.callbacks.length
  }

  defer(callback: (...args: Args) => unknown): void {
    this.callbacks.push(callback)
  }

  remove(callback: (...args: Args) => unknown): void {
    this.callbacks = this.callbacks.filter(x => x !== callback)
  }

  clear(): void {
    this.callbacks = []
  }

  execute(...args: Args): void {
    const callbacks = this.callbacks

    if (this.autoClear) {
      this.clear()
    }

    for (const callback of this.iterate(callbacks)) {
      callback(...args)
    }
  }

  executeSettled(...args: Args): void {
    const callbacks = this.callbacks

    if (this.autoClear) {
      this.clear()
    }

    for (const callback of this.iterate(callbacks)) {
      try {
        callback(...args)
      } catch {
        // pass
      }
    }
  }

  protected abstract iterate(
    callbacks: Array<(...args: Args) => unknown>
  ): Iterable<(...args: Args) => unknown>
}
