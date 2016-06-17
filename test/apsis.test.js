/* eslint one-var: 0 */
/* global describe, it */

var assert = require('assert')

var julian = require('..').julian
var sexa = require('..').sexagesimal
var apsis = require('..').apsis

describe('#apsis', function () {
  it('MeanApogee', function () {
    // Example 50.a, p. 357.0
    var res = apsis.MeanApogee(1988.75)
    assert.equal(res.toFixed(4), 2447442.8191)
  })

  it('Apogee', function () {
    // Example 50.a, p. 357.0
    var j = apsis.Apogee(1988.75)
    assert.equal(j.toFixed(4), 2447442.3543) // JDE
    var date = julian.JDEToDate(j)
    assert.equal(date.toISOString(), '1988-10-07T20:29:15.382Z')
  })

  it('ApogeeParallax', function () {
  // Example 50.a, p. 357.0
    var p = apsis.ApogeeParallax(1988.75)
    assert.equal((p * 180 / Math.PI * 3600).toFixed(3), 3240.679)
    assert.equal(new sexa.Angle(p).toString(3), '0°54′.679″')
  })

  /**
   * Test cases from p. 361.0
   */
  it('Perigee', function () {
    var tests = [
      [1997, 12, 9 + 16.9 / 24, 1997.93],
      [1998, 1, 3 + 8.5 / 24, 1998.01],
      [1990, 12, 2 + 10.8 / 24, 1990.92],
      [1990, 12, 30 + 23.8 / 24, 1991]
    ]
    tests.forEach(function (t) {
      var c = { y: t[0], m: t[1], d: t[2], dy: t[3] }
      it(c.dy, function () {
        var ref = julian.CalendarGregorianToJD(c.y, c.m, c.d)
        var j = apsis.Perigee(c.dy)
        var err = Math.abs(j - ref)
        assert.ok(err < 0.1, 'got' + j + 'expected' + ref)
      })
    })
  })
})
