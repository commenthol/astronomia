/* eslint one-var:0 no-multi-spaces:0 */

import assert from 'assert'
import float from './support/float.js'
import {
  rise,
  deltat,
  globe,
  julian,
  planetposition,
  sidereal,
  sexagesimal as sexa
} from '../src/index.js'
import { parallax } from '../src/moonposition.js'
import data from '../data/index.js'

describe('#rise', function () {
  const coord = {
    lat: new sexa.Angle(false, 42, 20, 0),
    lon: new sexa.Angle(false, 71, 5, 0)   // ! positively westward
  }
  const jd = julian.CalendarGregorianToJD(1988, 3, 20)
  const h0 = rise.stdh0Stellar()

  const α3 = [
    new sexa.RA(2, 42, 43.25).rad(),
    new sexa.RA(2, 46, 55.51).rad(),
    new sexa.RA(2, 51, 7.69).rad()
  ]
  const δ3 = [
    new sexa.Angle(false, 18, 2, 51.4).rad(),
    new sexa.Angle(false, 18, 26, 27.3).rad(),
    new sexa.Angle(false, 18, 49, 38.7).rad()
  ]

  const α = α3[1]
  const δ = δ3[1]

  describe('stdh0', function () {
    it('stdh0Stellar', function () {
      assert.strictEqual(rise.stdh0.stellar, -0.5666666666666667 * Math.PI / 180)
      assert.strictEqual(rise.stdh0Stellar(), -rise.meanRefraction)
    })
    it('stdh0Solar', function () {
      assert.strictEqual(rise.stdh0.solar, -0.01454441043328608)
      assert.strictEqual(rise.stdh0Solar(), -0.01454441043328608)
    })
    it('stdh0LunarMean', function () {
      assert.strictEqual(rise.stdh0.lunarMean, 0.125 * Math.PI / 180)
      assert.strictEqual(rise.stdh0.lunar, 0.7275 * Math.PI / 180)
    })
    describe('stdh0Lunar()', function () {
      function test (name, distance, stdh0Deg) {
        it(name, function () {
          const pi = parallax(distance) // horizontal parallax
          assert.strictEqual(rise.stdh0Lunar(pi) * 180 / Math.PI, stdh0Deg)
        })
      }
      test('perigee', 359861, -0.5537718610642937)
      test('apogee', 405948, -0.5552359277641975)
      test('mean', 359861 + (405948 - 359861) / 2, -0.5545479548967995)
    })
  })

  describe('methods', function () {
    const p = new globe.Coord(
      coord.lat.rad(),
      coord.lon.rad()
    )

    it('approxTimes', function () {
      // Example 15.a, p. 103.0
      // Meeus gives us the value of 11h 50m 58.1s but we have a package function for this:
      const Th0 = sidereal.apparent0UT(jd)
      const rs = rise.approxTimes(p, h0, Th0, α, δ)
      // Units for approximate values given near top of p. 104 are circles.
      assert.strictEqual(float(rs.rise / 86400).toFixed(5), 0.51816)
      assert.strictEqual(float(rs.transit / 86400).toFixed(5), 0.81965)
      assert.strictEqual(float(rs.set / 86400).toFixed(5), 0.12113)
    })

    it('times', function () {
      // Example 15.a, p. 103.0
      // Meeus gives us the value of 11h 50m 58.1s but we have a package function for this:
      const Th0 = sidereal.apparent0UT(jd)
      // Similarly as with Th0, Meeus gives us the value of 56 for ΔT but
      // let's use our package function.
      const ΔT = deltat.deltaT(new julian.Calendar().fromJD(jd).toYear())
      const rs = rise.times(p, ΔT, h0, Th0, α3, δ3)
      // v1 api
      assert.strictEqual(new sexa.Time(rs[0]).toString(0), '12ʰ25ᵐ26ˢ')
      assert.strictEqual(new sexa.Time(rs[1]).toString(0), '19ʰ40ᵐ30ˢ')
      assert.strictEqual(new sexa.Time(rs[2]).toString(0), '2ʰ54ᵐ40ˢ')
      // new v2 api
      assert.strictEqual(new sexa.Time(rs.rise).toString(0),    '12ʰ25ᵐ26ˢ')
      assert.strictEqual(new sexa.Time(rs.transit).toString(0), '19ʰ40ᵐ30ˢ')
      assert.strictEqual(new sexa.Time(rs.set).toString(0),     '2ʰ54ᵐ40ˢ')
    })
  })

  describe('PlanetRise', function () {
    const lat = coord.lat.deg()
    const lon = coord.lon.deg()
    const earth = new planetposition.Planet(data.vsop87Bearth)
    const venus = new planetposition.Planet(data.vsop87Bvenus)

    it('using approxTimes', function () {
      // Example 15.a, p. 103.0
      // using Date object
      const date = new Date(0)
      date.setUTCFullYear(1988)
      date.setUTCMonth(3 - 1)
      date.setUTCDate(20)
      const rs = new rise.PlanetRise(date, lat, lon, earth, venus, { date: true }).approxTimes()
      assert.strictEqual(rs.rise.toISOString(),    '1988-03-20T12:26:09.270Z')
      assert.strictEqual(rs.transit.toISOString(), '1988-03-20T19:40:17.578Z')
      assert.strictEqual(rs.set.toISOString(),     '1988-03-20T02:54:25.885Z')
    })
    it('using times', function () {
      // Example 15.a, p. 103.0
      const rs = new rise.PlanetRise(jd, lat, lon, earth, venus).times()
      assert.strictEqual(new julian.Calendar().fromJD(rs.rise).toDate().toISOString(),    '1988-03-20T12:25:25.629Z')
      assert.strictEqual(new julian.Calendar().fromJD(rs.transit).toDate().toISOString(), '1988-03-20T19:40:30.555Z')
      assert.strictEqual(new julian.Calendar().fromJD(rs.set).toDate().toISOString(),     '1988-03-20T02:54:40.159Z')
    })
  })
})
