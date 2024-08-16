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

const destructor = new Destructor()
try {
  const handle = open()
  destructor.defer(() => handle.close())
  // ...
} finally {
  await destructor.execute()
}
```

## API
### Constructor
```ts
class Constructor<Args extends unknown[] = []> {
  get size(): number

  constructor(options?: { autoClear?: boolean = true })

  defer(callback: (...args: Args) => Awaitable<unknown>): void
  remove(callback: (...args: Args) => Awaitable<unknown>): void
  clear(): void

  execute(...args: Args): Promise<void>
  executeSettled(...args: Args): Promise<void>

  all(concurrency: number = Infinity, ...args: Args): Promise<void>
  allSettled(concurrency: number = Infinity, ...args: Args): Promise<void>
}
```

Callbacks are executed in same order of `defer`.

### Destructor
```ts
class Destructor<Args extends unknown[] = []> {
  get size(): number

  constructor(options?: { autoClear?: boolean = true })

  defer(callback: (...args: Args) => Awaitable<unknown>): void
  remove(callback: (...args: Args) => Awaitable<unknown>): void
  clear(): void

  execute(...args: Args): Promise<void>
  executeSettled(...args: Args): Promise<void>

  all(concurrency: number = Infinity, ...args: Args): Promise<void>
  allSettled(concurrency: number = Infinity, ...args: Args): Promise<void>
}
```

Callbacks are executed in reverse order of `defer`.

### SyncConstructor
```ts
class SyncConstructor<Args extends unknown[] = []> {
  get size(): number

  constructor(options?: { autoClear?: boolean = true })

  defer(callback: (...args: Args) => unknown): void
  remove(callback: (...args: Args) => unknown): void
  clear(): void

  execute(...args: Args): void
  executeSettled(...args: Args): void
}
```

Callbacks are executed in same order of `defer`.

### SyncDestructor
```ts
class SyncDestructor<Args extends unknown[] = []> {
  get size(): number

  constructor(options?: { autoClear?: boolean = true })

  defer(callback: (...args: Args) => unknown): void
  remove(callback: (...args: Args) => unknown): void
  clear(): void

  execute(...args: Args): void
  executeSettled(...args: Args): void
}
```

Callbacks are executed in reverse order of `defer`.

### GeneratorConstructor
```ts
type ICallback<Yield, Next, Args extends unknown[]> = (...args: Args) =>
| void
| Generator<Yield, void, Next>

class GeneratorConstructor<Yield = unknown, Next = unknown, Args extends unknown[] = []> {
  get size(): number

  constructor(options?: { autoClear?: boolean = true })

  defer(callback: ICallback<Yield, Next, Args>): void
  remove(callback: ICallback<Yield, Next, Args>): void
  clear(): void

  execute(...args: Args): Generator<Yield, void, Next>
  executeSettled(...args: Args): Generator<Yield, void, Next>
}
```

Callbacks are executed in same order of `defer`.

### GeneratorDestructor
```ts
type ICallback<Yield, Next, Args extends unknown[]> = (...args: Args) =>
| void
| Generator<Yield, void, Next>

class GeneratorDestructor<Yield = unknown, Next = unknown, Args extends unknown[] = []> {
  get size(): number

  constructor(options?: { autoClear?: boolean = true })

  defer(callback: ICallback<Yield, Next, Args>): void
  remove(callback: ICallback<Yield, Next, Args>): void
  clear(): void

  execute(...args: Args): Generator<Yield, void, Next>
  executeSettled(...args: Args): Generator<Yield, void, Next>
}
```

Callbacks are executed in reverse order of `defer`.

### AsyncGeneratorConstructor
```ts
type ICallback<Yield, Next, Args extends unknown[]> = (...args: Args) =>
| void
| Generator<Yield, void, Next>
| AsyncGenerator<Yield, void, Next>

class AsyncGeneratorConstructor<
  Yield = unknown
, Next = unknown
, Args extends unknown[] = []
> {
  get size(): number

  constructor(options?: { autoClear?: boolean = true })

  defer(callback: ICallback<Yield, Next, Args>): void
  remove(callback: ICallback<Yield, Next, Args>): void
  clear(): void

  execute(...args: Args): AsyncGenerator<Yield, void, Next>
  executeSettled(...args: Args): AsyncGenerator<Yield, void, Next>
}
```

Callbacks are executed in same order of `defer`.

### AsyncGeneratorDestructor
```ts
type ICallback<Yield, Next, Args extends unknown[]> = (...args: Args) =>
| void
| Generator<Yield, void, Next>
| AsyncGenerator<Yield, void, Next>

class AsyncGeneratorDestructor<Yield = unknown, Next = unknown, Args extends unknown[] = []> {
  get size(): number

  constructor(options?: { autoClear?: boolean = true })

  defer(callback: ICallback<Yield, Next, Args>): void
  remove(callback: ICallback<Yield, Next, Args>): void
  clear(): void

  execute(...args: Args): AsyncGenerator<Yield, void, Next>
  executeSettled(...args: Args): AsyncGenerator<Yield, void, Next>
}
```

Callbacks are executed in reverse order of `defer`.
