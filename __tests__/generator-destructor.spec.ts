import { describe, test, expect, vi } from 'vitest'
import { GeneratorDestructor } from '@src/generator-destructor.js'
import { toArray } from '@blackglory/prelude'
import { getError } from 'return-style'

describe('GeneratorDestructor', () => {
  test('size', () => {
    const executor = new GeneratorDestructor()
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
    const executor = new GeneratorDestructor()
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    executor.defer(callback1)
    executor.defer(callback1)
    executor.defer(callback2)

    executor.remove(callback1)

    expect(executor.size).toBe(1)
  })

  test('clear', () => {
    const executor = new GeneratorDestructor()
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
      const executor = new GeneratorDestructor<unknown, unknown, [unknown]>()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      toArray(executor.execute(arg))

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith(arg)
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith(arg)
      expect(count1!).toBe(2)
      expect(count2!).toBe(1)
      expect(executor.size).toBe(0)
    })

    test('error', () => {
      const customError = new Error('custom error')
      const fn1 = vi.fn()
      const fn2 = vi.fn(function * () {
        throw customError
      })
      const executor = new GeneratorDestructor()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      const err = getError(() => toArray(executor.execute()))

      expect(err).toBe(customError)
      expect(fn1).toBeCalledTimes(0)
      expect(fn2).toBeCalledTimes(1)
      expect(executor.size).toBe(0)
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
      const executor = new GeneratorDestructor<unknown, unknown, [unknown]>()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      toArray(executor.executeSettled(arg))

      expect(fn1).toBeCalledTimes(1)
      expect(fn1).toBeCalledWith(arg)
      expect(fn2).toBeCalledTimes(1)
      expect(fn2).toBeCalledWith(arg)
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
      const executor = new GeneratorDestructor()
      executor.defer(fn1) // second run
      executor.defer(fn2) // first run

      toArray(executor.executeSettled())

      expect(fn1).toBeCalledTimes(1)
      expect(fn2).toBeCalledTimes(1)
      expect(executor.size).toBe(0)
    })
  })
})
