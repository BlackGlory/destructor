import { pass } from '@blackglory/prelude'

export abstract class SyncExecutor {
  protected callbacks: Array<() => unknown> = []

  abstract defer(callback: () => unknown): void

  get size() {
    return this.callbacks.length
  }

  remove(callback: () => unknown): void {
    this.callbacks = this.callbacks.filter(x => x !== callback)
  }

  execute(): void {
    const callbacks = this.callbacks
    this.callbacks = []
    callbacks.forEach(callback => callback())
  }

  executeSettled(): void {
    const callbacks = this.callbacks
    this.callbacks = []
    callbacks.forEach(callback => {
      try {
        callback()
      } catch {
        pass()
      }
    })
  }
}
