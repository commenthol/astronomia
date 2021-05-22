import assert from 'assert'
import float from './support/float.js'
import { base, julian, planetposition, solar, sexagesimal as sexa } from '../src/index.js'
import data from '../data/index.js'

describe('#solar', function () {
  const jde = julian.CalendarGregorianToJD(1992, 10, 13)
  const T = base.J2000Century(jde)

  it('apparentEquatorialVSOP87', function () {
    // Example 25.b, p. 169, but as this code uses the full VSOP87 theory,
    // results match those at bottom of p. 165.
    const planet = new planetposition.Planet(data.earth)
    const res = solar.apparentEquatorialVSOP87(planet, jde)

    assert.strictEqual(new sexa.RA(res.ra).toString(3), '13ʰ13ᵐ30.749ˢ')
    assert.strictEqual(new sexa.Angle(res.dec).toString(3), '-7°47′1.741″')
    assert.strictEqual(res.range, 0.997608521657578)
  })

  it('apparentEquatorialVSOP87D', function () {
    // Example 25.b, p. 169, but as this code uses the full VSOP87 theory,
    // results match those at bottom of p. 165.
    const planet = new planetposition.Planet(data.vsop87Dearth)
    const res = solar.apparentEquatorialVSOP87(planet, jde)

    assert.strictEqual(new sexa.RA(res.ra).toString(3), '13ʰ13ᵐ30.748ˢ')
    assert.strictEqual(new sexa.Angle(res.dec).toString(2), '-7°47′1.74″')
    assert.strictEqual(res.range, 0.9976085202355945)
  })

  it('Example true', function () {
    // Example 25.a, p. 165.
    const res = solar.true(T)

    assert.strictEqual(jde, 2448908.5)
    assert.strictEqual(float(T).toFixed(9), -0.072183436)
    assert.strictEqual(float(res.lon * 180 / Math.PI).toFixed(5), 199.90987)
    assert.strictEqual(float(res.ano).toFixed(5), 4.83625)
  })

  it('Example meanAnomaly', function () {
    // Example 25.a, p. 165.
    const res = solar.meanAnomaly(T) * 180 / Math.PI
    assert.strictEqual(float(res).toFixed(5), -2241.00603)
  })

  it('Example eccentricity', function () {
    // Example 25.a, p. 165.
    const res = solar.eccentricity(T)
    assert.strictEqual(float(res).toFixed(9), 0.016711668)
  })

  it('Example radius', function () {
    // Example 25.a, p. 165.
    const res = solar.radius(T)
    assert.strictEqual(float(res).toFixed(5), 0.99766) //  AU
  })

  it('Example apparentLongitude', function () {
    // Example 25.a, p. 165.
    const res = solar.apparentLongitude(T)
    assert.strictEqual(new sexa.Angle(res).toString(0), '199°54′32″')
  })

  it('Example apparentEquatorial', function () {
    // Example 25.a, p. 165.
    const res = solar.apparentEquatorial(jde)
    assert.strictEqual(new sexa.RA(res.ra).toString(1), '13ʰ13ᵐ31.4ˢ')
    assert.strictEqual(new sexa.Angle(res.dec).toString(0), '-7°47′6″')
  })
})
