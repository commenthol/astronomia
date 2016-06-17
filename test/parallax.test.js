/* eslint one-var: 0 */
/* global describe, it */

var assert = require('assert')

var base = require('..').base
var julian = require('..').julian
var parallax = require('..').parallax
var sidereal = require('..').sidereal
var sexa = require('..').sexagesimal

describe('#parallax', function () {
  it('horizontal', function () {
    // Example 40.a, p. 280
    var π = parallax.horizontal(0.37276)
    assert.equal((π * 180 / Math.PI * 60 * 60).toFixed(3), 23.592)
  })

  it('topocentric', function () {
    // Example 40.a, p. 280
    var a = parallax.topocentric(339.530208 * Math.PI / 180, -15.771083 * Math.PI / 180,
      0.37276, 0.546861, 0.836339,
      new sexa.HourAngle(false, 7, 47, 27).rad(),
      julian.CalendarGregorianToJD(2003, 8, 28 + (3 + 17.0 / 60) / 24)
    )
    var α = a[0], δ = a[1]
    assert.equal(new sexa.RA(α).toString(2), '22ʰ38ᵐ8.54ˢ')
    assert.equal(new sexa.Angle(δ).toString(1), '-15°46′30″')
  })

  it('topocentric2', function () {
    // Example 40.a, p. 280
    var a = parallax.topocentric2(339.530208 * Math.PI / 180, -15.771083 * Math.PI / 180,
      0.37276, 0.546861, 0.836339,
      new sexa.HourAngle(false, 7, 47, 27).rad(),
      julian.CalendarGregorianToJD(2003, 8, 28 + (3 + 17.0 / 60) / 24)
    )
    var Δα = a[0], Δδ = a[1]
    assert.equal((Δα * 180 / Math.PI * 60 * 60 / 15).toFixed(2), 1.29) // 1.29 sec of RA
    assert.equal((Δδ * 180 / Math.PI * 60 * 60).toFixed(1), -14.1) // -14.1 sec
  })

  it('topocentric3', function () {
    // same test case as example 40.a, p. 280
    var α = 339.530208 * Math.PI / 180
    var δ = -15.771083 * Math.PI / 180
    var Δ = 0.37276
    var ρsφʹ = 0.546861
    var ρcφʹ = 0.836339
    var L = new sexa.HourAngle(false, 7, 47, 27).rad()
    var jde = julian.CalendarGregorianToJD(2003, 8, 28 + (3 + 17.0 / 60) / 24)
    // reference result
    var a = parallax.topocentric(α, δ, Δ, ρsφʹ, ρcφʹ, L, jde)
    var αʹ = a[0], δʹ1 = a[1]
    // result to test
    a = parallax.topocentric3(α, δ, Δ, ρsφʹ, ρcφʹ, L, jde)
    var Hʹ = a[0], δʹ3 = a[1]
    // test
    var θ0 = new sexa.Time(sidereal.apparent(jde)).rad()
    var err = Math.abs(base.pmod(Hʹ - (θ0 - L - αʹ) + 1, 2 * Math.PI) - 1)
    assert.ok(err < 1e-15)
    assert.ok(Math.abs(δʹ3 - δʹ1) < 1e-15)
  })

  it('topocentricEcliptical', function () {
    // exercise, p. 282
    var a = parallax.topocentricEcliptical(
      new sexa.Angle(false, 181, 46, 22.5).rad(),
      new sexa.Angle(false, 2, 17, 26.2).rad(),
      new sexa.Angle(false, 0, 16, 15.5).rad(),
      new sexa.Angle(false, 50, 5, 7.8).rad(), 0,
      new sexa.Angle(false, 23, 28, 0.8).rad(),
      new sexa.Angle(false, 209, 46, 7.9).rad(),
      new sexa.Angle(false, 0, 59, 27.7).rad())
    var λʹ = a[0], βʹ = a[1], sʹ = a[2]
    var λʹa = new sexa.Angle(false, 181, 48, 5).rad()
    var βʹa = new sexa.Angle(false, 1, 29, 7.1).rad()
    var sʹa = new sexa.Angle(false, 0, 16, 25.5).rad()
    var err = Math.abs(λʹ - λʹa)
    assert.ok(err < 0.1 / 60 / 60 * Math.PI / 180)
    err = Math.abs(βʹ - βʹa)
    assert.ok(err < 0.1 / 60 / 60 * Math.PI / 180)
    err = Math.abs(sʹ - sʹa)
    assert.ok(err < 0.1 / 60 / 60 * Math.PI / 180)
  })
})
