import assert from 'assert'
import {globe, sidereal, coord, julian, sexagesimal as sexa} from '..'

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

  it('Equatorial.toEcliptic.toEquatorial', function () {
    // repeat example above
    var eq0 = new coord.Equatorial(
      new sexa.RA(7, 45, 18.946).rad(),
      new sexa.Angle(false, 28, 1, 34.26).rad()
    )
    var obl = 23.4392911 * Math.PI / 180
    var eq = eq0.toEcliptic(obl).toEquatorial(obl) // apply reverse transform

    assert.deepEqual(new sexa.RA(eq.ra).toDMS(), [false, 7, 45, 18.946])
    assert.deepEqual(new sexa.Angle(eq.dec).toDMS(), [false, 28, 1, 34.26])
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
      new sexa.Angle(false, 77, 3, 56).rad() // lon
    )
    var jd = julian.DateToJD(new Date(Date.UTC(1987, 3, 10, 19, 21, 0, 0)))
    var st = sidereal.apparent(jd)
    var hz = eq.toHorizontal(g, st)
    assert.deepEqual(new sexa.Angle(hz.az).toDegString(3), '68°.034')
    assert.deepEqual(new sexa.Angle(hz.alt).toDegString(3), '15°.125')
  })

  it('Equatorial.toHorizontal.toEquatorial', function () {
    // Example 13.b, p. 95.
    // Venus apparent equatorial coordinates
    var eq0 = new coord.Equatorial(
      new sexa.RA(23, 9, 16.641).rad(),
      new sexa.Angle(true, 6, 43, 11.61).rad()
    )
    // coordinates at Washington D.C. Longitude is measured positively westwards!
    var g = new globe.Coord(
      new sexa.Angle(false, 38, 55, 17).rad(), // lat
      new sexa.Angle(false, 77, 3, 56).rad() // lon
    )
    var jd = julian.DateToJD(new Date(Date.UTC(1987, 3, 10, 19, 21, 0, 0)))
    var st = sidereal.apparent(jd)
    var eq = eq0.toHorizontal(g, st).toEquatorial(g, st)
    assert.deepEqual(new sexa.RA(eq.ra).toDMS(), [false, 23, 9, 16.641])
    assert.deepEqual(new sexa.Angle(eq.dec).toString(4), '-6°43′11.61″')
  })

  it('Equatorial.toGalactic', function () {
    // Exercise, p. 96.
    var eq = new coord.Equatorial(
      new sexa.RA(17, 48, 59.74).rad(),
      new sexa.Angle('-', 14, 43, 8.2).rad()
    )
    var g = eq.toGalactic()
    assert.equal(new sexa.Angle(g.lon).toDegString(4), '12°.9593') // 12.9593
    assert.equal(new sexa.Angle(g.lat).toDegString(4), '6°.0463') // 6.0463
  })

  it('Equatorial.toGalactic.toEquatorial', function () {
    var eq0 = new coord.Equatorial(
      new sexa.RA(17, 48, 59.74).rad(),
      new sexa.Angle('-', 14, 43, 8.2).rad()
    )
    var eq = eq0.toGalactic().toEquatorial()
    assert.deepEqual(new sexa.RA(eq.ra).toDMS(), [false, 17, 48, 59.74])
    assert.deepEqual(new sexa.Angle(eq.dec).toString(4), '-14°43′8.2″')
  })
})
