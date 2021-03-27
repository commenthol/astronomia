import assert from 'assert'
import float from './support/float.js'
import { apparent, base, coord, julian, sexagesimal as sexa } from '../src/index.js'

describe('#apparent', function () {
  it('nutation', function () {
    // Example 23.a, p. 152
    const α = new sexa.RA(2, 46, 11.331).rad()
    const δ = new sexa.Angle(false, 49, 20, 54.54).rad()
    const jd = julian.CalendarGregorianToJD(2028, 11, 13.19)
    const res = apparent.nutation(α, δ, jd)
    assert.strictEqual(new sexa.Angle(res[0]).toString(3), '0°0′15.843″')
    assert.strictEqual(new sexa.Angle(res[1]).toString(3), '0°0′6.217″')
  })

  it('aberration', function () {
    // Example 23.a, p. 152
    const α = new sexa.RA(2, 46, 11.331).rad()
    const δ = new sexa.Angle(false, 49, 20, 54.54).rad()
    const jd = julian.CalendarGregorianToJD(2028, 11, 13.19)
    const res = apparent.aberration(α, δ, jd)
    assert.strictEqual(new sexa.Angle(res[0]).toString(3), '0°0′30.045″')
    assert.strictEqual(new sexa.Angle(res[1]).toString(3), '0°0′6.697″')
  })

  it('position', function () {
    // Example 23.a, p. 152
    const jd = julian.CalendarGregorianToJD(2028, 11, 13.19)
    const eq = new coord.Equatorial(
      new sexa.RA(2, 44, 11.986).rad(),
      new sexa.Angle(false, 49, 13, 42.48).rad()
    )
    const eqTo = apparent.position(eq, 2000, base.JDEToJulianYear(jd),
      new sexa.HourAngle(false, 0, 0, 0.03425).rad(),
      new sexa.Angle(true, 0, 0, 0.0895).rad()
    )
    assert.strictEqual(new sexa.RA(eqTo.ra).toString(3), '2ʰ46ᵐ14.39ˢ')
    assert.strictEqual(new sexa.Angle(eqTo.dec).toString(2), '49°21′7.45″')
  })

  it('aberrationRonVondrak', function () {
    // Example 23.b, p. 156
    const α = new sexa.RA(2, 44, 12.9747).rad()
    const δ = new sexa.Angle(false, 49, 13, 39.896).rad()
    const jd = julian.CalendarGregorianToJD(2028, 11, 13.19)
    const res = apparent.aberrationRonVondrak(α, δ, jd)
    assert.strictEqual(float(res[0]).toFixed(9), 0.000145252) // radian
    assert.strictEqual(float(res[1]).toFixed(9), 0.000032723) // radian
  })

  it('positionRonVondrak', function () {
    // Example 23.b, p. 156
    const jd = julian.CalendarGregorianToJD(2028, 11, 13.19)
    const eq = new coord.Equatorial(
      new sexa.RA(2, 44, 11.986).rad(),
      new sexa.Angle(false, 49, 13, 42.48).rad()
    )
    const eqTo = apparent.positionRonVondrak(
      eq, base.JDEToJulianYear(jd),
      new sexa.HourAngle(false, 0, 0, 0.03425),
      new sexa.Angle(true, 0, 0, 0.0895)
    )
    assert.strictEqual(new sexa.RA(eqTo.ra).toString(3), '2ʰ46ᵐ14.392ˢ')
    assert.strictEqual(new sexa.Angle(eqTo.dec).toString(2), '49°21′7.45″')
  })
})
