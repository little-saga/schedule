import { io } from 'little-saga'
import { wait, waitWithPredicate } from './wait'

export function* scheduleWorker(pattern, fn, ...args) {
  while (true) {
    yield io.call(wait, pattern)
    yield io.fork(fn, ...args)
  }
}

export function schedule(pattern, fn, ...args) {
  return io.fork(scheduleWorker, pattern, fn, ...args)
}

export function* scheduleWithPredicateWorker(pattern, predicate, fn, ...args) {
  while (true) {
    yield io.call(waitWithPredicate, pattern, predicate)
    yield io.fork(fn, ...args)
  }
}

export function scheduleWithPredicate(pattern, predicate, fn, ...args) {
  return io.fork(scheduleWithPredicateWorker, pattern, predicate, fn, ...args)
}
