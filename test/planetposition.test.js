/* globals describe, it */

'use strict'

var assert = require('assert')
var julian = require('..').julian
var sexa = require('..').sexagesimal
var planetposition = require('..').planetposition
var venusData = require('../data/vsop87Bvenus')

describe('#planetposition', function () {
  describe('position2000', function () {
    it('Mars at 2415020.0', function () {
      // Mars 1899 spherical data from vsop87.chk.
      var jd = 2415020.0
      var planet = new planetposition.Planet(planetposition.mars)
      var res = planet.position2000(jd)

      assert.equal(res.lon, 5.018579265623366)
      assert.equal(res.lat, -0.02740734998738619)
      assert.equal(res.range, 1.421877771845356)
    })

    it('Venus at 1992-12-20', function () {
      // Example 32.a, p. 219
      var jd = julian.CalendarGregorianToJD(1992, 12, 20)
      var planet = new planetposition.Planet(planetposition.venus)
      var res = planet.position2000(jd)

      assert.equal(res.lon, 0.45749253478276586)    // rad
      assert.equal(res.lat, -0.045729822980889484)  // rad
      assert.equal(res.range, 0.7246016739689574)   // AU
    })
  })

  describe('position', function () {
    it('Venus at 1992-12-20', function () {
      // Example 32.a, p. 219
      var jd = julian.CalendarGregorianToJD(1992, 12, 20)
      var planet = new planetposition.Planet(venusData)
      var res = planet.position(jd)
      assert.equal(new sexa.Angle(res.lon).toDegString(5), '26°.11412')
      assert.equal(new sexa.Angle(res.lat).toDegString(5), '-2°.6206')
      assert.equal(res.range, 0.7246016739689574)
    })
  })
})
