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
  var coord = {
    lat: new sexa.Angle(false, 42, 20, 0),
    lon: new sexa.Angle(false, 71, 5, 0)   // ! positively westward
  }
  var jd = julian.CalendarGregorianToJD(1988, 3, 20)
  var h0 = rise.Stdh0Stellar

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

  var α = α3[1]
  var δ = δ3[1]

  describe('Rise', function () {
    var lat = coord.lat.deg()
    var lon = coord.lon.deg()

    it('using approxTimes', function () {
      // Example 15.a, p. 103.0
      var rs = new rise.Rise(lat, lon, jd, h0, α, δ)
      assert.equal(new julian.Calendar().fromJD(rs.rise()).toDate().toISOString(), '1988-03-20T12:26:09.176Z')
      assert.equal(new julian.Calendar().fromJD(rs.transit()).toDate().toISOString(), '1988-03-20T19:40:17.417Z')
      assert.equal(new julian.Calendar().fromJD(rs.set()).toDate().toISOString(), '1988-03-20T02:54:25.658Z')
    })
    it('using times', function () {
      // Example 15.a, p. 103.0
      var rs = new rise.Rise(lat, lon, jd, h0, α3, δ3)
      assert.equal(new julian.Calendar().fromJD(rs.rise()).toDate().toISOString(), '1988-03-20T12:25:25.533Z')
      assert.equal(new julian.Calendar().fromJD(rs.transit()).toDate().toISOString(), '1988-03-20T19:40:30.393Z')
      assert.equal(new julian.Calendar().fromJD(rs.set()).toDate().toISOString(), '1988-03-20T02:54:39.932Z')
    })
  })

  describe('methods', function () {
    var p = new globe.Coord(
      coord.lat.rad(),
      coord.lon.rad()
    )

    it('approxTimes', function () {
      // Example 15.a, p. 103.0
      // Meeus gives us the value of 11h 50m 58.1s but we have a package function for this:
      var Th0 = sidereal.apparent0UT(jd)
      var a = rise.approxTimes(p, h0, Th0, α, δ)
      var mrise = a[0], mtransit = a[1], mset = a[2]
      // Units for approximate values given near top of p. 104 are circles.
      assert.equal((mrise / 86400).toFixed(5), 0.51816)
      assert.equal((mtransit / 86400).toFixed(5), 0.81965)
      assert.equal((mset / 86400).toFixed(5), 0.12113)
    })

    it('times', function () {
      // Example 15.a, p. 103.0
      // Meeus gives us the value of 11h 50m 58.1s but we have a package function for this:
      var Th0 = sidereal.apparent0UT(jd)
      // Similarly as with Th0, Meeus gives us the value of 56 for ΔT but
      // let's use our package function.
      var ΔT = deltat.deltaT(new julian.Calendar().fromJD(jd).toYear())
      var a = rise.times(p, ΔT, h0, Th0, α3, δ3)
      var mrise = a[0], mtransit = a[1], mset = a[2]
      assert.equal(new sexa.Time(mrise).toString(0), '12ʰ25ᵐ26ˢ')
      assert.equal(new sexa.Time(mtransit).toString(0), '19ʰ40ᵐ30ˢ')
      assert.equal(new sexa.Time(mset).toString(0), '2ʰ54ᵐ40ˢ')
    })
  })
})
