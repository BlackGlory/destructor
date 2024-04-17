import { GeneratorExecutor, ICallback } from './generator-executor.js'

export class GeneratorDestructor<Yield = unknown, Next = unknown> extends GeneratorExecutor<Yield, Next> {
  defer(callback: ICallback<Yield, Next>): void {
    this.callbacks.unshift(callback)
  }
}
