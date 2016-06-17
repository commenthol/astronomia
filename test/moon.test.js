/* eslint one-var: 0 */
/* global describe, it */

var assert = require('assert')

var julian = require('..').julian
var moon = require('..').moon
var planetposition = require('..').planetposition

var j = julian.CalendarGregorianToJD(1992, 4, 12)
var earth = new planetposition.Planet('earth')

describe('#moon', function () {
  it('physical', function () {
    var a = moon.physical(j, earth)
    var l = a[0],
      b = a[1],
      P = a[2],
      l0 = a[3],
      b0 = a[4]
    assert.equal((l * 180 / Math.PI).toFixed(2), -1.23)
    assert.equal((b * 180 / Math.PI).toFixed(2), 4.20)
    assert.equal((P * 180 / Math.PI).toFixed(2), 15.08)
    assert.equal((l0 * 180 / Math.PI).toFixed(2), 67.90)
    assert.equal((b0 * 180 / Math.PI).toFixed(2), 1.46)
  })

  it('sunAltitude', function () {
    var phy = moon.physical(j, earth)
    var l0 = phy[3]
    var b0 = phy[4]
    var h = moon.sunAltitude(-20 * Math.PI / 180, 9.7 * Math.PI / 180, l0, b0)
    assert.equal((h * 180 / Math.PI).toFixed(3), 2.318)
  })

  it('sunrise', function () {
    var j0 = julian.CalendarGregorianToJD(1992, 4, 15)
    var j = moon.sunrise(-20 * Math.PI / 180, 9.7 * Math.PI / 180, j0, earth)
    var date = new julian.CalendarGregorian().fromJD(j)
    assert.deepEqual(date, {
      year: 1992,
      month: 4,
      day: 11.806928920093924
    })
  })
})
