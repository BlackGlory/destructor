import { describe, test, expect, vi } from 'vitest'
import { SyncConstructor } from '@src/sync-constructor.js'
import { getError } from 'return-style'

describe('SyncConstructor', () => {
  test('size', () => {
    const executor = new SyncConstructor()
    const fn1 = vi.fn()
    const fn2 = vi.fn()

    const size1 = executor.size
    executor.defer(fn1)
    const size2 = executor.size
    executor.defer(fn1)
    const size3 = executor.size
    executor.defer(fn2)
    const size4 = executor.size

    expect(fn1).toBeCalledTimes(0)
    expect(fn2).toBeCalledTimes(0)
    expect(size1).toBe(0)
    expect(size2).toBe(1)
    expect(size3).toBe(2)
    expect(size4).toBe(3)
  })

  test('remove', () => {
    const executor = new SyncConstructor()
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    executor.defer(callback1)
    executor.defer(callback1)
    executor.defer(callback2)

    executor.remove(callback1)

    expect(executor.size).toBe(1)
  })

  test('clear', () => {
    const executor = new SyncConstructor()
    const callback = vi.fn()
    executor.defer(callback)

    executor.clear()

    expect(executor.size).toBe(0)
  })

  describe('execute', () => {
    test('no error', () => {
      const arg = {}
      let counter = 0
      let count1: number
      let count2: number
      const fn1 = vi.fn(() => {
        count1 = ++counter
      })
      const fn2 = vi.fn(() => {
        count2 = ++counter
      })
      const executor = new SyncConstructor<[unknown]>()
      executor.defer(fn1) // first run
      executor.defer(fn2) // second run

      executor.execute(arg)

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith(arg)
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith(arg)
      expect(count1!).toBe(1)
      expect(count2!).toBe(2)
      expect(executor.size).toBe(0)
    })

    test('error', () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn(() => { throw customError })
      const fn2 = vi.fn()
      const executor = new SyncConstructor()
      executor.defer(fn1) // first run
      executor.defer(fn2) // second run

      const err = getError(() => executor.execute())

      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(0)
      expect(executor.size).toBe(0)
    })

    test('autoClear: false', () => {
      const fn = vi.fn()
      const executor = new SyncConstructor({ autoClear: false })
      executor.defer(fn)

      executor.execute()

      expect(fn).toBeCalledTimes(1)
      expect(executor.size).toBe(1)
    })
  })

  describe('executeSettled', () => {
    test('no error', () => {
      const arg = {}
      let counter = 0
      let count1: number
      let count2: number
      const fn1 = vi.fn(() => {
        count1 = ++counter
      })
      const fn2 = vi.fn(() => {
        count2 = ++counter
      })
      const executor = new SyncConstructor<[unknown]>()
      executor.defer(fn1) // first run
      executor.defer(fn2) // second run

      executor.executeSettled(arg)

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith(arg)
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith(arg)
      expect(count1!).toBe(1)
      expect(count2!).toBe(2)
      expect(executor.size).toBe(0)
    })

    test('error', () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn(() => { throw customError })
      const fn2 = vi.fn()
      const executor = new SyncConstructor()
      executor.defer(fn1) // first run
      executor.defer(fn2) // second run

      executor.executeSettled()

      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(executor.size).toBe(0)
    })

    test('autoClear: false', () => {
      const fn = vi.fn()
      const executor = new SyncConstructor({ autoClear: false })
      executor.defer(fn)

      executor.executeSettled()

      expect(fn).toBeCalledTimes(1)
      expect(executor.size).toBe(1)
    })
  })
})
