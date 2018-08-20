import { delay, io } from 'little-saga'
import { wait, waitWithPredicate } from '../src'
import { THRESHOLD } from '../src/constant'
import getNow from '../src/getNow'

test('wait', () => {
  // 等到下一分钟开始的时候
  const gen = wait({ minute: '*' })
  expect(gen.next().value).toEqual(io.call(delay, THRESHOLD))
  expect(gen.next().value).toEqual(io.call(getNow))
  const d = new Date()
  // 设置为 20秒
  d.setSeconds(20)
  d.setMilliseconds(0)
  // 还需要等待 40秒，才到下一分钟
  expect(gen.next(d).value).toEqual(io.call(delay, 40e3))
})

test('waitWithPredicate', () => {
  const pattern = { minute: '*' }
  const predicate = d => d.getMinutes() % 5 === 0

  const gen = waitWithPredicate(pattern, predicate)
  expect(gen.next().value).toEqual(io.call(wait, pattern))

  const d1 = new Date()
  expect(gen.next().value).toEqual(io.call(getNow))
  d1.setMinutes(1)
  expect(gen.next(d1).value).toEqual(io.call(wait, pattern))

  const d2 = new Date()
  expect(gen.next().value).toEqual(io.call(getNow))
  d2.setMinutes(2)
  expect(gen.next(d2).value).toEqual(io.call(wait, pattern))

  const d3 = new Date()
  expect(gen.next().value).toEqual(io.call(getNow))
  d3.setMinutes(5) // 将分钟设置为 5 的倍数，使其满足 predicate
  expect(gen.next(d3)).toEqual({ done: true, value: undefined })
})
