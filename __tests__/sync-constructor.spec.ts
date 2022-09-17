import { SyncConstructor } from '@src/sync-constructor'
import { getError } from 'return-style'

describe('SyncConstructor', () => {
  test('remove', () => {
    const executor = new SyncConstructor()
    const callback = jest.fn()
    executor.defer(callback)
    executor.defer(callback)

    executor.remove(callback)
    executor.execute()

    expect(callback).not.toBeCalled()
  })

  describe('execute', () => {
    test('no error', () => {
      let counter = 0
      let count1: number
      let count2: number
      const fn1 = jest.fn(() => {
        count1 = ++counter
      })
      const fn2 = jest.fn(() => {
        count2 = ++counter
      })
      const destructor = new SyncConstructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      destructor.execute()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(count1!).toBe(1)
      expect(count2!).toBe(2)
    })

    test('error', () => {
      const customError = new Error('custom error')
      const fn1 = jest.fn(() => { throw customError })
      const fn2 = jest.fn()
      const destructor = new SyncConstructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      const err = getError(() => destructor.execute())
      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(0)
    })
  })

  describe('executeSettled', () => {
    test('no error', () => {
      let counter = 0
      let count1: number
      let count2: number
      const fn1 = jest.fn(() => {
        count1 = ++counter
      })
      const fn2 = jest.fn(() => {
        count2 = ++counter
      })
      const destructor = new SyncConstructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      destructor.executeSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(count1!).toBe(1)
      expect(count2!).toBe(2)
    })

    test('error', () => {
      const customError = new Error('custom error')
      const fn1 = jest.fn(() => { throw customError })
      const fn2 = jest.fn()
      const destructor = new SyncConstructor()

      destructor.defer(fn1) // first run
      destructor.defer(fn2) // second run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      destructor.executeSettled()
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
    })
  })
})
