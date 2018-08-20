import getNow from '../src/getNow'

test('getNow', () => {
  const actual = getNow().getTime()
  const expected = new Date().getTime()
  expect(Math.abs(actual - expected) < 5).toBe(true)
})
