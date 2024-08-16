import { describe, test, expect, vi } from 'vitest'
import { AsyncGeneratorDestructor } from '@src/async-generator-destructor.js'
import { toArrayAsync } from '@blackglory/prelude'
import { getErrorAsync } from 'return-style'

describe('AsyncGeneratorDestructor', () => {
  test('defer', () => {
    const executor = new AsyncGeneratorDestructor()
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
    const executor = new AsyncGeneratorDestructor()
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    executor.defer(callback1)
    executor.defer(callback1)
    executor.defer(callback2)

    executor.remove(callback1)

    expect(executor.size).toBe(1)
  })

  test('clear', () => {
    const executor = new AsyncGeneratorDestructor()
    const callback = vi.fn()
    executor.defer(callback)

    executor.clear()

    expect(executor.size).toBe(0)
  })

  describe('execute', () => {
    test('no error', async () => {
      let counter = 0
      let count1: number
      let count2: number
      const fn1 = vi.fn(() => {
        count1 = ++counter
      })
      const fn2 = vi.fn(() => {
        count2 = ++counter
      })
      const executor = new AsyncGeneratorDestructor()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      await toArrayAsync(executor.execute())

      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(count1!).toBe(2)
      expect(count2!).toBe(1)
      expect(executor.size).toBe(0)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn(function * () {
        throw customError
      })
      const executor = new AsyncGeneratorDestructor()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      const err = await getErrorAsync(() => toArrayAsync(executor.execute()))

      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(1)
      expect(executor.size).toBe(0)
    })

    test('autoClear: false', async () => {
      const fn = vi.fn()
      const executor = new AsyncGeneratorDestructor({ autoClear: false })
      executor.defer(fn)

      await toArrayAsync(executor.execute())

      expect(fn).toBeCalledTimes(1)
      expect(executor.size).toBe(1)
    })
  })

  describe('executeSettled', () => {
    test('no error', async () => {
      let counter = 0
      let count1: number
      let count2: number
      const fn1 = vi.fn(() => {
        count1 = ++counter
      })
      const fn2 = vi.fn(() => {
        count2 = ++counter
      })
      const executor = new AsyncGeneratorDestructor()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      await toArrayAsync(executor.executeSettled())

      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(count1!).toBe(2)
      expect(count2!).toBe(1)
      expect(executor.size).toBe(0)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn(function* () {
        throw customError
      })
      const executor = new AsyncGeneratorDestructor()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      await toArrayAsync(executor.executeSettled())

      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(executor.size).toBe(0)
    })

    test('autoClear: false', async () => {
      const fn = vi.fn()
      const executor = new AsyncGeneratorDestructor({ autoClear: false })
      executor.defer(fn)

      await toArrayAsync(executor.executeSettled())

      expect(fn).toBeCalledTimes(1)
      expect(executor.size).toBe(1)
    })
  })
})
