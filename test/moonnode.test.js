import assert from 'assert'
import float from './support/float.js'
import { julian, moonnode } from '../src/index.js'

describe('#moonnode', function () {
  it('ascending', function () {
    // Example 51.a, p. 365.0
    const j = moonnode.ascending(1987.37)
    const date = new julian.CalendarGregorian().fromJD(j).toISOString()
    assert.strictEqual(float(j).toFixed(5), 2446938.76803)
    assert.strictEqual(date, '1987-05-23T06:25:57.743Z')
  })
})
