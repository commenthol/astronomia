/* globals describe, it */

'use strict'

var assert = require('assert')
var sexa = require('..').sexagesimal
var globe = require('..').globe
var julian = require('..').julian
var sidereal = require('..').sidereal
var coord = require('..').coord

// var oit = it.only

describe('#coord', function () {
  it('Equatorial.toEcliptic', function () {
    // Example 13.a, p. 95.
    var eq = new coord.Equatorial(
      new sexa.RA(7, 45, 18.946).rad(),
      new sexa.Angle(false, 28, 1, 34.26).rad()
    )
    var obl = 23.4392911 * Math.PI / 180
    var ecl = eq.toEcliptic(obl)
    var λ = new sexa.Angle(ecl.lon).toDegString(5)
    var β = new sexa.Angle(ecl.lat).toDegString(5)
    assert.equal(λ, '113°.21563')
    assert.equal(β, '6°.68417')
  })

  it('Equatorial.toEcliptic and reverse transform', function () {
    // repeat example above
    var eq0 = new coord.Equatorial(
      new sexa.RA(7, 45, 18.946).rad(),
      new sexa.Angle(false, 28, 1, 34.26).rad()
    )
    var obl = 23.4392911 * Math.PI / 180
    var eq = eq0.toEcliptic(obl).toEquatorial(obl)

    var err = (eq.ra - eq0.ra) / eq.ra
    assert.ok(Math.abs(err) < 1e-15, [err, eq0.ra, eq.ra].join(', '))
    err = (eq.dec - eq0.dec) / eq.dec
    assert.ok(Math.abs(err) < 1e-15, [err, eq0.dec, eq.dec].join(', '))
  })

  it('Equatorial.toHorizontal', function () {
    // Example 13.b, p. 95.
    // Venus apparent equatorial coordinates
    var eq = new coord.Equatorial(
      new sexa.RA(23, 9, 16.641).rad(),
      new sexa.Angle(true, 6, 43, 11.61).rad()
    )
    // coordinates at Washington D.C. Longitude is measured positively westwards!
    var g = new globe.Coord(
      new sexa.Angle(false, 38, 55, 17).rad(), // lat
      new sexa.Angle(false, 77, 3, 56).rad()   // lon
    )
    var jd = julian.DateToJD(new Date(Date.UTC(1987, 3, 10, 19, 21, 0, 0)))
    var st = sidereal.apparent(jd)
    var hz = eq.toHorizontal(g, st)

    var aStr = new sexa.Angle(hz.az).toDegString(3)
    var hStr = new sexa.Angle(hz.alt).toDegString(3)
    assert.equal(aStr, '68°.034')
    assert.equal(hStr, '15°.125')
  })

  it('Equatorial.toGalactic', function () {
    var eq = new coord.Equatorial(
      new sexa.RA(17, 48, 59.74).rad(),
      new sexa.Angle(true, 14, 43, 8.2).rad()
    )
    var g = eq.toGalactic()
    assert.equal(new sexa.Angle(g.lon).toDegString(4), '12°.9593') // 12.9593
    assert.equal(new sexa.Angle(g.lat).toDegString(4), '6°.0463') // 6.0463
  })

  // reverse transform does not fit yet
  it.skip('Equatorial.toGalactic reverse transform', function () {
    var eq0 = new coord.Equatorial(
      new sexa.RA(17, 48, 59.74).rad(),
      new sexa.Angle(true, 14, 43, 8.2).rad()
    )
    var eq = eq0.toGalactic().toEquatorial()
    console.log(eq0)
    console.log(eq)
    // assert.deepEqual(new sexa.RA().toHMS(eq.ra), [ false, 17, 48, 59.74 ])
    assert.equal(new sexa.Angle(eq.dec).toString(4), '-14°43′8.2″')
  })
})

/*

Equatorial { RA: 4.664373518221282,  Dec: -0.2568940429736831 }
Equatorial { RA: 1.5227808646314889, Dec: -0.25689404297368346 }

*/
