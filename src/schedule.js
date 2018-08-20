import { io } from 'little-saga'
import { wait, waitWithPredicate } from './wait'

export function schedule(pattern, fn, ...args) {
  return io.fork(function* scheduleWorker() {
    while (true) {
      yield io.call(wait, pattern)
      yield io.fork(fn, ...args)
    }
  })
}

export function scheduleWithPredicate(pattern, predicate, fn, ...args) {
  return io.fork(function* scheduleWorker() {
    while (true) {
      yield io.call(waitWithPredicate, pattern, predicate)
      yield io.fork(fn, ...args)
    }
  })
}
