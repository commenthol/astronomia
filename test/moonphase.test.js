/* eslint no-multi-spaces: 0 */

import assert from 'assert'
import {julian, moonphase} from '..'

describe('#moonphase', function () {
  describe('mean', function () {
    it('new', function () {
      // Example 49.a, p. 353.
      var dyear = new julian.CalendarGregorian(1977, 2, 14).toYear()
      var jde = moonphase.meanNew(dyear)
      assert.equal(jde.toFixed(5), 2443192.94102)
    })

    it('last', function () {
      // Example 49.b, p. 353.
      var dyear = new julian.CalendarGregorian(2044, 1, 16).toYear()
      var jde = moonphase.meanLast(dyear)
      assert.equal(jde.toFixed(5), 2467636.88597)
    })
  })

  describe('with corrections', function () {
    it('new', function () {
      // Example 49.a, p. 353.
      var dyear = new julian.CalendarGregorian(1977, 2, 14).toYear()
      var jde = moonphase.newMoon(dyear)
      assert.equal(jde.toFixed(5), 2443192.65118)
      assert.equal(julian.JDToDate(jde).toISOString(), '1977-02-18T03:37:42.183Z')
      // Example 10.a p.78
      assert.equal(julian.JDEToDate(jde).toISOString(), '1977-02-18T03:36:54.534Z')
    })

    it('last', function () {
      // Example 49.b, p. 353.
      var dyear = new julian.CalendarGregorian(2044, 1, 16).toYear()
      var jde = moonphase.last(dyear)
      assert.equal(jde.toFixed(5), 2467636.49186)
      assert.equal(julian.JDToDate(jde).toISOString(), '2044-01-21T23:48:16.956Z')
    })

    // When is Chinese New Year? Helmer Aslaksen
    // <http://www.math.nus.edu.sg/aslaksen/calendar/cal2.pdf>
    describe('new moon', function () {
      var tests = [
        {hunt: [1990, 10, 18], exp: '1990-10-18T23:36:31+0800'},
        {hunt: [1990, 11, 17], exp: '1990-11-17T17:04:27+0800'},
        {hunt: [1990, 12, 17], exp: '1990-12-17T12:21:43+0800'},
        {hunt: [1991,  1, 16], exp: '1991-01-16T07:49:41+0800'},
        {hunt: [1991,  2, 15], exp: '1991-02-15T01:31:47+0800'}
      ]
      tests.forEach(function (t) {
        var y = t.hunt[0]
        var m = t.hunt[1]
        var d = t.hunt[2]
        it(t.hunt.join('-'), function () {
          var dyear = new julian.CalendarGregorian(y, m, d).toYear()
          var jde = moonphase.new(dyear)
          var date = julian.JDEToDate(jde)
          var err = Math.abs(date.getTime() - new Date(t.exp).getTime())
          assert.ok(err < 1000, date.toISOString())
        })
      })
    })
  })
})
