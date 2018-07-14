import { always, delay, io } from 'little-saga'
import moment from 'moment'
import { THRESHOLD, TIME_UNITS } from './constant'
import TimeCalculator from './TimeCalculator'

function parsePowerPattern(powerPattern) {
  const pattern = {}

  for (const unit of TIME_UNITS) {
    const pat = powerPattern[unit]
    if (pat != null) {
      // TODO 思考 power-pattern 有哪些功能
      pattern[unit] = pat
    }
  }

  return { pattern, predicate: always(true) }
}

export function* waitUntilMatchPattern(pattern) {
  const calculator = new TimeCalculator(pattern)
  const now = yield io.call(moment)
  const delta = calculator.calculate(now)
  yield io.call(delay, delta)
}

export function* wait(powerPattern) {
  const { pattern, predicate } = parsePowerPattern(powerPattern)
  while (true) {
    yield io.call(delay, THRESHOLD)
    yield io.call(waitUntilMatchPattern, pattern)
    const now = yield io.call(moment)
    if (predicate(now)) {
      return now
    }
  }
}

export function schedule(powerPattern, fn, ...args) {
  return io.fork(function* scheduleWorker() {
    while (true) {
      const date = yield io.call(wait, powerPattern)
      yield io.fork(fn, ...args, date)
    }
  })
}
