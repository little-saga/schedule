import { always, io } from 'little-saga'
import { schedule, scheduleWithPredicate, wait, waitWithPredicate } from '../src'
import { scheduleWithPredicateWorker, scheduleWorker } from '../src/schedule'

test('schedule', () => {
  const pattern = { minute: [0, 20, 40] }
  const fn = () => null
  const args = [1, 2, 3]

  expect(schedule(pattern, fn, ...args)).toEqual(io.fork(scheduleWorker, pattern, fn, ...args))
})

test('scheduleWorker', () => {
  const pattern = { minute: [0, 20, 40] }
  const fn = () => null
  const args = [1, 2, 3]
  const gen = scheduleWorker(pattern, fn, ...args)

  for (let i = 0; i < 10; i++) {
    expect(gen.next()).toEqual({
      done: false,
      value: io.call(wait, pattern),
    })
    expect(gen.next()).toEqual({
      done: false,
      value: io.fork(fn, ...args),
    })
  }
})

test('scheduleWithPredicate', async () => {
  const pattern = { minute: [0, 20, 40] }
  const predicate = always(true)
  const fn = () => null
  const args = [1, 2, 3]

  expect(scheduleWithPredicate(pattern, predicate, fn, ...args)).toEqual(
    io.fork(scheduleWithPredicateWorker, pattern, predicate, fn, ...args),
  )
})

test('scheduleWithPredicateWorker', () => {
  const pattern = { minute: [0, 20, 40] }
  const fn = () => null
  const predicate = always(true)
  const args = [1, 2, 3]
  const gen = scheduleWithPredicateWorker(pattern, predicate, fn, ...args)

  for (let i = 0; i < 10; i++) {
    expect(gen.next()).toEqual({
      done: false,
      value: io.call(waitWithPredicate, pattern, predicate),
    })
    expect(gen.next()).toEqual({
      done: false,
      value: io.fork(fn, ...args),
    })
  }
})
