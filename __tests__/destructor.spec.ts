import { describe, test, expect, vi } from 'vitest'
import { Destructor } from '@src/destructor.js'
import { delay } from 'extra-promise'
import { getErrorPromise } from 'return-style'

const TIME_ERROR = 1

describe('Destructor', () => {
  test('defer', () => {
    const executor = new Destructor()
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
    const executor = new Destructor()
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    executor.defer(callback1)
    executor.defer(callback1)
    executor.defer(callback2)

    executor.remove(callback1)

    expect(executor.size).toBe(1)
  })

  test('clear', () => {
    const executor = new Destructor()
    const callback = vi.fn()
    executor.defer(callback)

    executor.clear()

    expect(executor.size).toBe(0)
  })

  describe('execute', () => {
    test('no error', async () => {
      const arg = {}
      let timestamp1: number
      let timestamp2: number
      const fn1 = vi.fn(async () => {
        timestamp1 = Date.now()
      })
      const fn2 = vi.fn(async () => {
        timestamp2 = Date.now()
        await delay(1000)
      })
      const executor = new Destructor<[unknown]>()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      await executor.execute(arg)

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith(arg)
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith(arg)
      expect(timestamp1! - timestamp2!).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      expect(executor.size).toBe(0)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn().mockRejectedValue(customError)
      const executor = new Destructor()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      const err = await getErrorPromise(executor.execute())

      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(1)
      expect(executor.size).toBe(0)
    })
  })

  describe('executeSettled', () => {
    test('no error', async () => {
      const arg = {}
      let timestamp1: number
      let timestamp2: number
      const fn1 = vi.fn(async () => {
        timestamp1 = Date.now()
      })
      const fn2 = vi.fn(async () => {
        timestamp2 = Date.now()
        await delay(1000)
      })
      const executor = new Destructor<[unknown]>()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      await executor.executeSettled(arg)

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith(arg)
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith(arg)
      expect(timestamp1! - timestamp2!).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      expect(executor.size).toBe(0)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn().mockRejectedValue(customError)
      const executor = new Destructor()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      await executor.executeSettled()

      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(executor.size).toBe(0)
    })
  })

  describe('all', () => {
    test('no error', async () => {
      const arg = {}
      let timestamp1: number
      let timestamp2: number
      const fn1 = vi.fn(async () => {
        timestamp1 = Date.now()
      })
      const fn2 = vi.fn(async () => {
        timestamp2 = Date.now()
        await delay(1000)
      })
      const executor = new Destructor<[unknown]>()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      await executor.all(Infinity, arg)

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith(arg)
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith(arg)
      expect(timestamp1! - timestamp2!).toBeLessThan(1000)
      expect(executor.size).toBe(0)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn().mockRejectedValue(customError)
      const executor = new Destructor()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      const err = await getErrorPromise(executor.all())

      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(executor.size).toBe(0)
    })
  })

  describe('allSettled', () => {
    test('no error', async () => {
      const arg = {}
      let timestamp1: number
      let timestamp2: number
      const fn1 = vi.fn(async () => {
        timestamp1 = Date.now()
      })
      const fn2 = vi.fn(async () => {
        timestamp2 = Date.now()
        await delay(1000)
      })
      const executor = new Destructor<[unknown]>()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      await executor.allSettled(Infinity, arg)

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith(arg)
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith(arg)
      expect(timestamp1! - timestamp2!).toBeLessThan(1000)
      expect(executor.size).toBe(0)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn().mockRejectedValue(customError)
      const executor = new Destructor()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      await executor.allSettled()

      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(executor.size).toBe(0)
    })
  })
})
