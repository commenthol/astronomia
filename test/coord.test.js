import assert from 'assert'
import { globe, sidereal, coord, julian, sexagesimal as sexa } from '../src/index.js'

describe('#coord', function () {
  it('Equatorial.toEcliptic', function () {
    // Example 13.a, p. 95.
    const eq = new coord.Equatorial(
      new sexa.RA(7, 45, 18.946).rad(),
      new sexa.Angle(false, 28, 1, 34.26).rad()
    )
    const obl = 23.4392911 * Math.PI / 180
    const ecl = eq.toEcliptic(obl)
    const λ = new sexa.Angle(ecl.lon).toDegString(5)
    const β = new sexa.Angle(ecl.lat).toDegString(5)
    assert.strictEqual(λ, '113°.21563')
    assert.strictEqual(β, '6°.68417')
  })

  it('Equatorial.toEcliptic.toEquatorial', function () {
    // repeat example above
    const eq0 = new coord.Equatorial(
      new sexa.RA(7, 45, 18.946).rad(),
      new sexa.Angle(false, 28, 1, 34.26).rad()
    )
    const obl = 23.4392911 * Math.PI / 180
    const eq = eq0.toEcliptic(obl).toEquatorial(obl) // apply reverse transform

    assert.deepStrictEqual(new sexa.RA(eq.ra).toDMS(), [false, 7, 45, 18.946])
    assert.deepStrictEqual(new sexa.Angle(eq.dec).toDMS(), [false, 28, 1, 34.26])
  })

  it('Equatorial.toHorizontal', function () {
    // Example 13.b, p. 95.
    // Venus apparent equatorial coordinates
    const eq = new coord.Equatorial(
      new sexa.RA(23, 9, 16.641).rad(),
      new sexa.Angle(true, 6, 43, 11.61).rad()
    )
    // coordinates at Washington D.C. Longitude is measured positively westwards!
    const g = new globe.Coord(
      new sexa.Angle(false, 38, 55, 17).rad(), // lat
      new sexa.Angle(false, 77, 3, 56).rad() // lon
    )
    const jd = julian.DateToJD(new Date(Date.UTC(1987, 3, 10, 19, 21, 0, 0)))
    const st = sidereal.apparent(jd)
    const hz = eq.toHorizontal(g, st)
    assert.deepStrictEqual(new sexa.Angle(hz.az).toDegString(3), '68°.034')
    assert.deepStrictEqual(new sexa.Angle(hz.alt).toDegString(3), '15°.125')
  })

  it('Equatorial.toHorizontal.toEquatorial', function () {
    // Example 13.b, p. 95.
    // Venus apparent equatorial coordinates
    const eq0 = new coord.Equatorial(
      new sexa.RA(23, 9, 16.641).rad(),
      new sexa.Angle(true, 6, 43, 11.61).rad()
    )
    // coordinates at Washington D.C. Longitude is measured positively westwards!
    const g = new globe.Coord(
      new sexa.Angle(false, 38, 55, 17).rad(), // lat
      new sexa.Angle(false, 77, 3, 56).rad() // lon
    )
    const jd = julian.DateToJD(new Date(Date.UTC(1987, 3, 10, 19, 21, 0, 0)))
    const st = sidereal.apparent(jd)
    const eq = eq0.toHorizontal(g, st).toEquatorial(g, st)
    assert.deepStrictEqual(new sexa.RA(eq.ra).toDMS(), [false, 23, 9, 16.641])
    assert.deepStrictEqual(new sexa.Angle(eq.dec).toString(4), '-6°43′11.61″')
  })

  it('Equatorial.toGalactic', function () {
    // Exercise, p. 96.
    const eq = new coord.Equatorial(
      new sexa.RA(17, 48, 59.74).rad(),
      new sexa.Angle(true, 14, 43, 8.2).rad()
    )
    const g = eq.toGalactic()
    assert.strictEqual(new sexa.Angle(g.lon).toDegString(4), '12°.9593') // 12.9593
    assert.strictEqual(new sexa.Angle(g.lat).toDegString(4), '6°.0463') // 6.0463
  })

  it('Equatorial.toGalactic.toEquatorial', function () {
    const eq0 = new coord.Equatorial(
      new sexa.RA(17, 48, 59.74).rad(),
      new sexa.Angle(true, 14, 43, 8.2).rad()
    )
    const eq = eq0.toGalactic().toEquatorial()
    assert.deepStrictEqual(new sexa.RA(eq.ra).toDMS(), [false, 17, 48, 59.74])
    assert.deepStrictEqual(new sexa.Angle(eq.dec).toString(4), '-14°43′8.2″')
  })
})
