/* global describe, it */

var assert = require('assert')

var julian = require('..').julian
var line = require('..').line
var sexa = require('..').sexagesimal

describe('#line', function () {
  it('time', function () {
    // Example 19.a, p. 121.0

    // convert degree data to radians
    // apparent equatorial coordinates Castor
    var r1 = 113.56833 * Math.PI / 180
    var d1 = 31.89756 * Math.PI / 180
    // apparent equatorial coordinates Pollux
    var r2 = 116.25042 * Math.PI / 180
    var d2 = 28.03681 * Math.PI / 180
    // apparent equatorial coordinates Mars from 29/9 to 3/10/1994
    var r3 = [118.98067, 119.59396, 120.20413, 120.81108, 121.41475].map(function (ri) {
      return ri * Math.PI / 180
    })
    var d3 = [21.68417, 21.58983, 21.49394, 21.39653, 21.29761].map(function (di) {
      return di * Math.PI / 180
    })

    // use JD as time to handle month boundary
    var jd = line.time(r1, d1, r2, d2, r3, d3,
      julian.CalendarGregorianToJD(1994, 9, 29),
      julian.CalendarGregorianToJD(1994, 10, 3)
    )

    var date = new julian.CalendarGregorian().fromJD(jd)
    assert.equal(date.toISOString(), '1994-10-01T05:21:33.530Z')
  })

  it('angle', function () {
    // Example p. 123.0
    var rgd = new sexa.RA(5, 32, 0.40).rad()
    var dgd = new sexa.Angle(true, 0, 17, 56.9).rad()
    var rge = new sexa.RA(5, 36, 12.81).rad()
    var dge = new sexa.Angle(true, 1, 12, 7.0).rad()
    var rgz = new sexa.RA(5, 40, 45.52).rad()
    var dgz = new sexa.Angle(true, 1, 56, 33.3).rad()

    var n = line.angle(rgd, dgd, rge, dge, rgz, dgz)
    assert.equal((n * 180 / Math.PI).toFixed(4), 172.4830) // degrees
    assert.equal(new sexa.Angle(n).toString(0), '172°28′59″')
  })

  it('error', function () {
    // Example p. 124.0
    var rgd = new sexa.RA(5, 32, 0.40).rad()
    var dgd = new sexa.Angle(true, 0, 17, 56.9).rad()
    var rge = new sexa.RA(5, 36, 12.81).rad()
    var dge = new sexa.Angle(true, 1, 12, 7.0).rad()
    var rgz = new sexa.RA(5, 40, 45.52).rad()
    var dgz = new sexa.Angle(true, 1, 56, 33.3).rad()

    var gw = line.error(rgz, dgz, rgd, dgd, rge, dge)
    var e = new sexa.Angle(gw)
    assert.equal(e.toDegString(6), '0°.089876')
    assert.equal((gw * 180 / Math.PI * 3600).toFixed(0), 324)
  })

  it('angleError()', function () {
    // Example p. 125.0
    var rgd = new sexa.RA(5, 32, 0.40).rad()
    var dgd = new sexa.Angle(true, 0, 17, 56.9).rad()
    var rge = new sexa.RA(5, 36, 12.81).rad()
    var dge = new sexa.Angle(true, 1, 12, 7.0).rad()
    var rgz = new sexa.RA(5, 40, 45.52).rad()
    var dgz = new sexa.Angle(true, 1, 56, 33.3).rad()

    var res = line.angleError(rgd, dgd, rge, dge, rgz, dgz)
    var n = res[0]
    var gw = res[1]
    assert.equal(new sexa.Angle(n).toString(0), '7°31′1″')
    assert.equal(new sexa.Angle(gw).toString(0), '-0°5′24″')
  })
})
