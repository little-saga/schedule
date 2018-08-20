import { delay, io } from 'little-saga'
import { THRESHOLD } from './constant'
import getNow from './getNow'
import TimeCalculator from './TimeCalculator'

export function* wait(pattern) {
  yield io.call(delay, THRESHOLD)
  const calculator = new TimeCalculator(pattern)
  const now = yield io.call(getNow)
  const delta = calculator.calculate(now)
  yield io.call(delay, delta)
}

export function* waitWithPredicate(pattern, predicate) {
  while (true) {
    yield io.call(wait, pattern)
    const now = yield io.call(getNow)
    if (predicate(now)) {
      return
    }
  }
}
