/* eslint one-var: 0 */
/* global describe, it */

'use strict'

var assert = require('assert')

var deltat = require('..').deltat
var globe = require('..').globe
var julian = require('..').julian
var rise = require('..').rise
var sidereal = require('..').sidereal
var sexa = require('..').sexagesimal

describe('#rise', function () {
  it('approxTimes', function () {
    // Example 15.a, p. 103.0
    var jd = julian.CalendarGregorianToJD(1988, 3, 20)
    var p = new globe.Coord(
      new sexa.Angle(false, 42, 20, 0).rad(), // lat
      new sexa.Angle(false, 71, 5, 0).rad()   // lon
    )
    // Meeus gives us the value of 11h 50m 58.1s but we have a package
    // function for this:
    var Th0 = sidereal.apparent0UT(jd)
    var α = new sexa.RA(2, 46, 55.51).rad()
    var δ = new sexa.Angle(false, 18, 26, 27.3).rad()
    var h0 = rise.Stdh0Stellar
    var a = rise.approxTimes(p, h0, Th0, α, δ)
    var mrise = a[0], mtransit = a[1], mset = a[2]
    // Units for approximate values given near top of p. 104 are circles.
    assert.equal((mrise / 86400).toFixed(5), 0.51816)
    assert.equal((mtransit / 86400).toFixed(5), 0.81965)
    assert.equal((mset / 86400).toFixed(5), 0.12113)
  })

  it('times', function () {
    // Example 15.a, p. 103.0
    var cal = new julian.CalendarGregorian(1988, 3, 20)
    var p = new globe.Coord(
      new sexa.Angle(false, 42, 20, 0).rad(), // lat
      new sexa.Angle(false, 71, 5, 0).rad()   // lon
    )
    // Meeus gives us the value of 11h 50m 58.1s but we have a package
    // function for this:
    var Th0 = sidereal.apparent0UT(cal.toJD())
    var α3 = [
      new sexa.RA(2, 42, 43.25).rad(),
      new sexa.RA(2, 46, 55.51).rad(),
      new sexa.RA(2, 51, 7.69).rad()
    ]
    var δ3 = [
      new sexa.Angle(false, 18, 2, 51.4).rad(),
      new sexa.Angle(false, 18, 26, 27.3).rad(),
      new sexa.Angle(false, 18, 49, 38.7).rad()
    ]
    var h0 = rise.Stdh0Stellar
    // Similarly as with Th0, Meeus gives us the value of 56 for ΔT but
    // let's use our package function.
    var ΔT = deltat.deltaT(cal.toYear())

    var a = rise.times(p, ΔT, h0, Th0, α3, δ3)
    var mrise = a[0], mtransit = a[1], mset = a[2]
    assert.equal(new sexa.Time(mrise).toString(0), '12ʰ26ᵐ9ˢ')
    assert.equal(new sexa.Time(mtransit).toString(0), '19ʰ40ᵐ30ˢ')
    assert.equal(new sexa.Time(mset).toString(0), '2ʰ54ᵐ26ˢ')
  })
})
