# extra-defer
## Install
```sh
npm install --save extra-defer
# or
yarn add extra-defer
```

## Usage
```ts
import { Destructor } from 'extra-defer'

const d = new Destructor()
try {
  const handle = open()
  d.defer(() => handle.close())
  // ...
} finally {
  await d.execute()
}
```

## API
### Constructor
```ts
class Constructor {
  get size(): number

  defer(callback: () => Awaitable<unknown>): void
  remove(callback: () => Awaitable<unknown>): void

  execute(): Promise<void>
  executeSettled(): Promise<void>

  all(concurrency: number = Infinity): Promise<void>
  allSettled(concurrency: number = Infinity): Promise<void>
}
```

Callbacks are executed in same order of `defer`.

### Destructor
```ts
class Destructor {
  get size(): number

  defer(callback: () => Awaitable<unknown>): void
  remove(callback: () => Awaitable<unknown>): void

  execute(): Promise<void>
  executeSettled(): Promise<void>

  all(concurrency: number = Infinity): Promise<void>
  allSettled(concurrency: number = Infinity): Promise<void>
}
```

Callbacks are executed in reverse order of `defer`.

### SyncConstructor
```ts
class SyncConstructor {
  get size(): number

  defer(callback: () => unknown): void
  remove(callback: () => unknown): void

  execute(): void
  executeSettled(): void
}
```

Callbacks are executed in same order of `defer`.

### SyncDestructor
```ts
class SyncDestructor {
  get size(): number

  defer(callback: () => unknown): void
  remove(callback: () => unknown): void

  execute(): void
  executeSettled(): void
}
```

Callbacks are executed in reverse order of `defer`.

### GeneratorConstructor
```ts
type ICallback<Yield, Next> = () =>
| void
| Generator<Yield, void, Next>

class GeneratorConstructor<Yield = unknown, Next = unknown> extends GeneratorExecutor<Yield, Next> {
  get size(): number

  defer(callback: ICallback<Yield, Next>): void
  remove(callback: ICallback<Yield, Next>): void

  execute(): Generator<Yield, void, Next>
  executeSettled(): Generator<Yield, void, Next>
}
```

Callbacks are executed in same order of `defer`.

### GeneratorDestructor
```ts
type ICallback<Yield, Next> = () =>
| void
| Generator<Yield, void, Next>

class GeneratorDestructor<Yield = unknown, Next = unknown> extends GeneratorExecutor<Yield, Next> {
  get size(): number

  defer(callback: ICallback<Yield, Next>): void
  remove(callback: ICallback<Yield, Next>): void

  execute(): Generator<Yield, void, Next>
  executeSettled(): Generator<Yield, void, Next>
}
```

Callbacks are executed in reverse order of `defer`.

### AsyncGeneratorConstructor
```ts
type ICallback<Yield, Next> = () =>
| void
| Generator<Yield, void, Next>
| AsyncGenerator<Yield, void, Next>

class AsyncGeneratorConstructor<Yield = unknown, Next = unknown> extends AsyncGeneratorExecutor<Yield, Next> {
  get size(): number

  defer(callback: ICallback<Yield, Next>): void
  remove(callback: ICallback<Yield, Next>): void

  execute(): AsyncGenerator<Yield, void, Next>
  executeSettled(): AsyncGenerator<Yield, void, Next>
}
```

Callbacks are executed in same order of `defer`.

### AsyncGeneratorDestructor
```ts
type ICallback<Yield, Next> = () =>
| void
| Generator<Yield, void, Next>
| AsyncGenerator<Yield, void, Next>

class AsyncGeneratorDestructor<Yield = unknown, Next = unknown> extends AsyncGeneratorExecutor<Yield, Next> {
  get size(): number

  defer(callback: ICallback<Yield, Next>): void
  remove(callback: ICallback<Yield, Next>): void

  execute(): AsyncGenerator<Yield, void, Next>
  executeSettled(): AsyncGenerator<Yield, void, Next>
}
```

Callbacks are executed in reverse order of `defer`.
