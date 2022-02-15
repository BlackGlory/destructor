# destructor
## Install
```sh
npm install --save @blackglory/destructor
# or
yarn add @blackglory/destructor
```

## Usage
```ts
import { Destructor, withDestructor } from '@blackglory/destructor'

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
