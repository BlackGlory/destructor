import { pass } from '@blackglory/pass'

export abstract class SyncExecutor {
  protected callbacks: Array<() => unknown> = []

  abstract defer(callback: () => unknown): void

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
