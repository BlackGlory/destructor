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
