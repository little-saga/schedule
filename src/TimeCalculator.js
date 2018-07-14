import moment from 'moment'
import { TIME_UNITS } from './constant'

const cmp = (x, y) => x - y

function testPattern(pattern, value) {
  if (pattern === '*') {
    return true
  } else {
    return pattern.includes(value)
  }
}

// 寻找数组中第一个大于等于 val 的数字的下标
function binarySearch(array, val) {
  let low = 0
  let high = array.length
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (array[mid] < val) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  return low
}

function normalizePattern(pattern) {
  if (pattern === '*') {
    return pattern
  } else if (typeof pattern === 'number') {
    return [pattern]
  } else if (Array.isArray(pattern)) {
    console.assert(pattern.length > 0)
    pattern.forEach(p => console.assert(typeof p === 'number'))
    return pattern.slice().sort(cmp)
  } else {
    throw new Error('Invalid pattern')
  }
}

export default class TimeCalculator {
  constructor(pattern) {
    let defaultPattern = '*'

    for (const unit of TIME_UNITS) {
      if (pattern[unit] == null) {
        pattern[unit] = defaultPattern
      } else {
        defaultPattern = 0
      }
      pattern[unit] = normalizePattern(pattern[unit])
    }

    this.pattern = pattern
  }

  /** @param m {moment.Moment} */
  calculate(m) {
    const pat = this.pattern
    const t = {
      millisecond: m.millisecond(),
      second: m.second(),
      minute: m.minute(),
      hour: m.hour(),
    }

    let delta = 0

    if (pat.millisecond !== '*') {
      const index = binarySearch(pat.millisecond, t.millisecond)
      if (index === pat.millisecond.length) {
        delta += 1000 + pat.millisecond[0] - t.millisecond
        t.second++
      } else {
        delta += pat.millisecond[index] - t.millisecond
      }
    }

    if (pat.second !== '*') {
      const index = binarySearch(pat.second, t.second)
      if (index === pat.second.length) {
        delta += 1000 * (60 + pat.second[0] - t.second)
        t.minute++
      } else {
        delta += 1000 * (pat.second[index] - t.second)
      }
    }

    if (pat.minute !== '*') {
      const index = binarySearch(pat.minute, t.minute)
      if (index === pat.minute.length) {
        delta += 60 * 1000 * (60 + pat.minute[0] - t.minute)
        t.hour++
      } else {
        delta += 60 * 1000 * (pat.minute[index] - t.minute)
      }
    }

    if (pat.hour !== '*') {
      const index = binarySearch(pat.hour, t.hour)
      if (index === pat.hour.length) {
        delta += 60 * 60 * 1000 * (24 + pat.hour[0] - t.hour)
      } else {
        delta += 60 * 60 * 1000 * (pat.hour[index] - t.hour)
      }
    }

    return delta
  }

  /** @param m {moment.Moment} */
  test(m) {
    const pats = this.pattern
    return [
      testPattern(pats.hour, m.hour()),
      testPattern(pats.minute, m.minute()),
      testPattern(pats.second, m.second()),
      testPattern(pats.millisecond, m.millisecond()),
    ].every(Boolean)
  }
}
