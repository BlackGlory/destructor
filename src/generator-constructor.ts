import { GeneratorExecutor, ICallback } from './generator-executor.js'

export class GeneratorConstructor<Yield = unknown, Next = unknown> extends GeneratorExecutor<Yield, Next> {
  defer(callback: ICallback<Yield, Next>): void {
    this.callbacks.push(callback)
  }
}
