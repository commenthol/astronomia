/* global describe, it */
/* eslint key-spacing: 0 */

var assert = require('assert')

var elliptic = require('..').elliptic
var julian = require('..').julian
var planetposition = require('..').planetposition
var sexa = require('..').sexagesimal

describe('elliptic', function () {
  var earth = new planetposition.Planet('earth')

  it('position()', function () {
    // Example 33.a, p. 225.0  VSOP87 result p. 227.0
    var venus = new planetposition.Planet('venus')
    var eq = elliptic.position(venus, earth, 2448976.5)
    assert.equal(new sexa.RA(eq.ra).toString(3), '21ʰ4ᵐ41.454ˢ')
    assert.equal(new sexa.Angle(eq.dec).toString(2), '-18°53′16.84″')
  })

  it('Elements.position()', function () {
    // Example 33.b, p. 232.0
    var k = new elliptic.Elements({
      axis:  2.2091404,
      ecc:   0.8502196,
      inc:   11.94524 * Math.PI / 180,
      node:  334.75006 * Math.PI / 180,
      argP:  186.23352 * Math.PI / 180,
      timeP: julian.CalendarGregorianToJD(1990, 10, 28.54502)
    })
    var j = julian.CalendarGregorianToJD(1990, 10, 6)
    var pos = k.position(j, earth)
    var ga = pos.ra // ascension
    var gd = pos.dec // declination
    var gps = pos.elongation // elongation
    assert.equal(new sexa.RA(ga).toString(1), '10ʰ34ᵐ14.2ˢ')
    assert.equal(new sexa.Angle(gd).toString(0), '19°9′31″')
    assert.equal((gps * 180 / Math.PI).toFixed(2), 40.51)
  })

  it('velocity()', function () {
    // Example 33.c, p. 238
    assert.equal(elliptic.velocity(17.9400782, 1).toFixed(2), 41.53)
  })

  it('vPerihelion()', function () {
    // Example 33.c, p. 238
    assert.equal(elliptic.vPerihelion(17.9400782, 0.96727426).toFixed(2), 54.52)
  })

  it('vAphelion()', function () {
    assert.equal(elliptic.vAphelion(17.9400782, 0.96727426).toFixed(2), 0.91)
  })

  it('length1()', function () {
    // Example 33.d, p. 239
    assert.equal(elliptic.length1(17.9400782, 0.96727426).toFixed(2), 77.06)
  })

  it('length2()', function () {
    // Example 33.d, p. 239
    assert.equal(elliptic.length2(17.9400782, 0.96727426).toFixed(2), 77.09)
  })

  /*
  it('length3()', function () {
    // Example 33.d, p. 239
    assert.equal(elliptic.length3(17.9400782, 0.96727426).toFixed(2), 77.07)
  })
  */

  it('length4()', function () {
    // Example 33.d, p. 239
    assert.equal(elliptic.length4(17.9400782, 0.96727426).toFixed(2), 77.07)
  })
})
