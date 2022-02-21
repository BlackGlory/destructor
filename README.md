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
### Destructor
```ts
class Destructor {
  defer(callback: () => void | PromiseLike<void>): void

  execute(): Promise<void>
  executeSettled(): Promise<void>

  all(concurrency: number = Infinity): Promise<void>
  allSettled(concurrency: number = Infinity): Promise<void>
}
```

Callbacks are executed in reverse order of `defer`.

### Constructor
```ts
class Constructor {
  defer(callback: () => void | PromiseLike<void>): void

  execute(): Promise<void>
  executeSettled(): Promise<void>

  all(concurrency: number = Infinity): Promise<void>
  allSettled(concurrency: number = Infinity): Promise<void>
}
```

Callbacks are executed in same order of `defer`.
