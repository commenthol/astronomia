/* eslint no-multi-spaces: 0 */

import assert from 'assert'
import float from './support/float.js'
import { julian, moonphase } from '../src/index.js'

describe('#moonphase', function () {
  describe('mean', function () {
    it('new', function () {
      // Example 49.a, p. 353.
      const dyear = new julian.CalendarGregorian(1977, 2, 14).toYear()
      const jde = moonphase.meanNew(dyear)
      assert.strictEqual(float(jde).toFixed(5), 2443192.94102)
    })

    it('last', function () {
      // Example 49.b, p. 353.
      const dyear = new julian.CalendarGregorian(2044, 1, 16).toYear()
      const jde = moonphase.meanLast(dyear)
      assert.strictEqual(float(jde).toFixed(5), 2467636.88597)
    })
  })

  describe('with corrections', function () {
    it('new', function () {
      // Example 49.a, p. 353.
      const dyear = new julian.CalendarGregorian(1977, 2, 14).toYear()
      const jde = moonphase.newMoon(dyear)
      assert.strictEqual(float(jde).toFixed(5), 2443192.65118)
      assert.strictEqual(julian.JDToDate(jde).toISOString(), '1977-02-18T03:37:42.183Z')
      // Example 10.a p.78
      assert.strictEqual(julian.JDEToDate(jde).toISOString(), '1977-02-18T03:36:54.534Z')
    })

    it('last', function () {
      // Example 49.b, p. 353.
      const dyear = new julian.CalendarGregorian(2044, 1, 16).toYear()
      const jde = moonphase.last(dyear)
      assert.strictEqual(float(jde).toFixed(5), 2467636.49186)
      assert.strictEqual(julian.JDToDate(jde).toISOString(), '2044-01-21T23:48:16.956Z')
    })

    // When is Chinese New Year? Helmer Aslaksen
    // <http://www.math.nus.edu.sg/aslaksen/calendar/cal2.pdf>
    describe('new moon', function () {
      const tests = [
        { hunt: [1990, 10, 18], exp: '1990-10-18T23:36:31+0800' },
        { hunt: [1990, 11, 17], exp: '1990-11-17T17:04:27+0800' },
        { hunt: [1990, 12, 17], exp: '1990-12-17T12:21:43+0800' },
        { hunt: [1991,  1, 16], exp: '1991-01-16T07:49:41+0800' },
        { hunt: [1991,  2, 15], exp: '1991-02-15T01:31:47+0800' }
      ]
      tests.forEach(function (t) {
        const y = t.hunt[0]
        const m = t.hunt[1]
        const d = t.hunt[2]
        it(t.hunt.join('-'), function () {
          const dyear = new julian.CalendarGregorian(y, m, d).toYear()
          const jde = moonphase.new(dyear)
          const date = julian.JDEToDate(jde)
          const err = Math.abs(date.getTime() - new Date(t.exp).getTime())
          assert.ok(err < 1000, date.toISOString())
        })
      })
    })
  })
})
