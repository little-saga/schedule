import { ForkEffect } from 'little-saga'

type PatternField = '*' | number | number[]

type Predicate<T> = (t: T) => boolean

export interface Pattern {
  hour?: PatternField
  minute?: PatternField
  second?: PatternField
  millisecond?: PatternField
}

export function wait(pattern: Pattern): IterableIterator<any>

export function waitWithPredicate(
  pattern: Pattern,
  predicate: Predicate<Date>,
): IterableIterator<any>

export function schedule<ARGS extends any[]>(
  pattern: Pattern,
  fn: (...args: ARGS) => any,
  ...args: ARGS
): ForkEffect

export function scheduleWithPredicate<ARGS extends any[]>(
  pattern: Pattern,
  predicate: Predicate<Date>,
  fn: (...args: ARGS) => any,
  ...args: ARGS
): ForkEffect

export class TimeCalculator {
  constructor(patter: Pattern)

  calculate(date: Date): number

  test(date: Date): boolean
}
