import { describe, test, expect, vi } from 'vitest'
import { AsyncGeneratorDestructor } from '@src/async-generator-destructor.js'
import { toArrayAsync } from '@blackglory/prelude'
import { getErrorAsync } from 'return-style'

describe('AsyncGeneratorDestructor', () => {
  test('size', () => {
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
    executor.remove(fn1)
    const size5 = executor.size

    expect(size1).toBe(0)
    expect(size2).toBe(1)
    expect(size3).toBe(2)
    expect(size4).toBe(3)
    expect(size5).toBe(1)
  })

  test('remove', async () => {
    const executor = new AsyncGeneratorDestructor()
    const callback = vi.fn()
    executor.defer(callback)
    executor.defer(callback)

    executor.remove(callback)
    await toArrayAsync(executor.execute())

    expect(callback).not.toBeCalled()
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
      const destructor = new AsyncGeneratorDestructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await toArrayAsync(destructor.execute())
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(count1!).toBe(2)
      expect(count2!).toBe(1)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn(function * () {
        throw customError
      })
      const destructor = new AsyncGeneratorDestructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      const err = await getErrorAsync(() => toArrayAsync(destructor.execute()))
      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(1)
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
      const destructor = new AsyncGeneratorDestructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await toArrayAsync(destructor.executeSettled())
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(count1!).toBe(2)
      expect(count2!).toBe(1)
    })

    test('error', async () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn(function* () {
        throw customError
      })
      const destructor = new AsyncGeneratorDestructor()

      destructor.defer(fn1) // second run
      destructor.defer(fn2) // first run

      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(0)
      await toArrayAsync(destructor.executeSettled())
      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
    })
  })
})
