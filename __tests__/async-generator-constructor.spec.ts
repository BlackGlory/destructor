import { describe, test, expect, vi } from 'vitest'
import { AsyncGeneratorConstructor } from '@src/async-generator-constructor.js'
import { toArrayAsync } from '@blackglory/prelude'
import { getErrorAsync } from 'return-style'

describe('AsyncGeneratorConstructor', () => {
  test('defer', () => {
    const executor = new AsyncGeneratorConstructor()
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
    const executor = new AsyncGeneratorConstructor()
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    executor.defer(callback1)
    executor.defer(callback1)
    executor.defer(callback2)

    executor.remove(callback1)

    expect(executor.size).toBe(1)
  })

  test('clear', () => {
    const executor = new AsyncGeneratorConstructor()
    const callback = vi.fn()
    executor.defer(callback)

    executor.clear()

    expect(executor.size).toBe(0)
  })

  describe('execute', () => {
    test('no error', async () => {
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
      const executor = new AsyncGeneratorConstructor<unknown, unknown, [unknown]>()
      executor.defer(fn1) // first run
      executor.defer(fn2) // second run

      await toArrayAsync(executor.execute(arg))

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith(arg)
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith(arg)
      expect(count1!).toBe(1)
      expect(count2!).toBe(2)
      expect(executor.size).toBe(0)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn(function* () {
        throw customError
      })
      const fn2 = vi.fn()
      const executor = new AsyncGeneratorConstructor()
      executor.defer(fn1) // first run
      executor.defer(fn2) // second run

      const err = await getErrorAsync(() => toArrayAsync(executor.execute()))

      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(0)
      expect(executor.size).toBe(0)
    })

    test('autoClear: false', async () => {
      const fn = vi.fn()
      const executor = new AsyncGeneratorConstructor({ autoClear: false })
      executor.defer(fn)

      await toArrayAsync(executor.execute())

      expect(fn).toBeCalledTimes(1)
      expect(executor.size).toBe(1)
    })
  })

  describe('executeSettled', () => {
    test('no error', async () => {
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
      const executor = new AsyncGeneratorConstructor<unknown, unknown, [unknown]>()
      executor.defer(fn1) // first run
      executor.defer(fn2) // second run

      await toArrayAsync(executor.executeSettled(arg))

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith(arg)
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith(arg)
      expect(count1!).toBe(1)
      expect(count2!).toBe(2)
      expect(executor.size).toBe(0)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn(function* () {
        throw customError
      })
      const fn2 = vi.fn()
      const executor = new AsyncGeneratorConstructor()
      executor.defer(fn1) // first run
      executor.defer(fn2) // second run

      await toArrayAsync(executor.executeSettled())

      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(executor.size).toBe(0)
    })

    test('autoClear: false', async () => {
      const fn = vi.fn()
      const executor = new AsyncGeneratorConstructor({ autoClear: false })
      executor.defer(fn)

      await toArrayAsync(executor.executeSettled())

      expect(fn).toBeCalledTimes(1)
      expect(executor.size).toBe(1)
    })
  })
})
