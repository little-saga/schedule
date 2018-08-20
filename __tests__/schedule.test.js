import { runSaga, delay } from 'little-saga'
import { schedule, scheduleWithPredicate } from '../src'

const every100 = []
for (let i = 0; i < 100; i++) {
  every100.push(100 * i)
}

test('schedule', async () => {
  const array = []

  runSaga({}, function*() {
    yield schedule({ millisecond: every100 }, () => {
      const d = new Date()
      array.push(d.getMilliseconds())
    })
  })

  await delay(2000)
  expect(array.length).toBeGreaterThanOrEqual(18)
  expect(array.length).toBeLessThanOrEqual(21)
  expect(array.every(ms => ms % 100 < 30)).toBe(true)
})

test('scheduleWithPredicate', async () => {
  const predicate = date => {
    return date.getMilliseconds() >= 500
  }

  const array = []

  runSaga({}, function*() {
    yield scheduleWithPredicate({ millisecond: every100 }, predicate, () => {
      const d = new Date()
      array.push(d.getMilliseconds())
    })
  })

  await delay(2000)
  expect(array.length).toBeGreaterThanOrEqual(8)
  expect(array.length).toBeLessThanOrEqual(11)
  expect(array.every(ms => ms >= 500 && ms % 100 < 30)).toBe(true)
})
