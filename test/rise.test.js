/* eslint one-var:0 no-multi-spaces:0 */

import assert from 'assert'
import {
  rise,
  deltat,
  globe,
  julian,
  planetposition,
  data,
  sidereal,
  sexagesimal as sexa
} from '..'

describe('#rise', function () {
  var coord = {
    lat: new sexa.Angle(false, 42, 20, 0),
    lon: new sexa.Angle(false, 71, 5, 0)   // ! positively westward
  }
  var jd = julian.CalendarGregorianToJD(1988, 3, 20)
  var h0 = rise.stdh0Stellar()

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

  describe('stdh0', function () {
    it('stdh0Stellar', function () {
      assert.equal(rise.stdh0Stellar(), -rise.meanRefraction)
      assert.equal(rise.stdh0.stellar, -rise.meanRefraction)
    })
    it('stdh0Solar', function () {
      assert.equal(rise.stdh0Solar(), -0.01454441043328608)
      assert.equal(rise.stdh0.solar, -0.01454441043328608)
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
      var rs = rise.approxTimes(p, h0, Th0, α, δ)
      // Units for approximate values given near top of p. 104 are circles.
      assert.equal((rs.rise / 86400).toFixed(5), 0.51816)
      assert.equal((rs.transit / 86400).toFixed(5), 0.81965)
      assert.equal((rs.set / 86400).toFixed(5), 0.12113)
    })

    it('times', function () {
      // Example 15.a, p. 103.0
      // Meeus gives us the value of 11h 50m 58.1s but we have a package function for this:
      var Th0 = sidereal.apparent0UT(jd)
      // Similarly as with Th0, Meeus gives us the value of 56 for ΔT but
      // let's use our package function.
      var ΔT = deltat.deltaT(new julian.Calendar().fromJD(jd).toYear())
      var rs = rise.times(p, ΔT, h0, Th0, α3, δ3)
      // v1 api
      assert.equal(new sexa.Time(rs[0]).toString(0), '12ʰ25ᵐ26ˢ')
      assert.equal(new sexa.Time(rs[1]).toString(0), '19ʰ40ᵐ30ˢ')
      assert.equal(new sexa.Time(rs[2]).toString(0), '2ʰ54ᵐ40ˢ')
      // new v2 api
      assert.equal(new sexa.Time(rs.rise).toString(0),    '12ʰ25ᵐ26ˢ')
      assert.equal(new sexa.Time(rs.transit).toString(0), '19ʰ40ᵐ30ˢ')
      assert.equal(new sexa.Time(rs.set).toString(0),     '2ʰ54ᵐ40ˢ')
    })
  })

  describe('PlanetRise', function () {
    var lat = coord.lat.deg()
    var lon = coord.lon.deg()
    var earth = new planetposition.Planet(data.vsop87Bearth)
    var venus = new planetposition.Planet(data.vsop87Bvenus)

    it('using approxTimes', function () {
      // Example 15.a, p. 103.0
      // using Date object
      var date = new Date(0)
      date.setUTCFullYear(1988)
      date.setUTCMonth(3 - 1)
      date.setUTCDate(20)
      var rs = new rise.PlanetRise(date, lat, lon, earth, venus, {date: true}).approxTimes()
      assert.equal(rs.rise.toISOString(),    '1988-03-20T12:26:09.270Z')
      assert.equal(rs.transit.toISOString(), '1988-03-20T19:40:17.578Z')
      assert.equal(rs.set.toISOString(),     '1988-03-20T02:54:25.885Z')
    })
    it('using times', function () {
      // Example 15.a, p. 103.0
      var rs = new rise.PlanetRise(jd, lat, lon, earth, venus).times()
      assert.equal(new julian.Calendar().fromJD(rs.rise).toDate().toISOString(),    '1988-03-20T12:25:25.629Z')
      assert.equal(new julian.Calendar().fromJD(rs.transit).toDate().toISOString(), '1988-03-20T19:40:30.555Z')
      assert.equal(new julian.Calendar().fromJD(rs.set).toDate().toISOString(),     '1988-03-20T02:54:40.159Z')
    })
  })
})
