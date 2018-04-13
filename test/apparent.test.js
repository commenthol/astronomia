import assert from 'assert'
import {apparent, base, coord, julian, sexagesimal as sexa} from '..'

describe('#apparent', function () {
  it('nutation', function () {
    // Example 23.a, p. 152
    var α = new sexa.RA(2, 46, 11.331).rad()
    var δ = new sexa.Angle(false, 49, 20, 54.54).rad()
    var jd = julian.CalendarGregorianToJD(2028, 11, 13.19)
    var res = apparent.nutation(α, δ, jd)
    assert.equal(new sexa.Angle(res[0]).toString(3), '0°0′15.843″')
    assert.equal(new sexa.Angle(res[1]).toString(3), '0°0′6.217″')
  })

  it('aberration', function () {
    // Example 23.a, p. 152
    var α = new sexa.RA(2, 46, 11.331).rad()
    var δ = new sexa.Angle(false, 49, 20, 54.54).rad()
    var jd = julian.CalendarGregorianToJD(2028, 11, 13.19)
    var res = apparent.aberration(α, δ, jd)
    assert.equal(new sexa.Angle(res[0]).toString(3), '0°0′30.045″')
    assert.equal(new sexa.Angle(res[1]).toString(3), '0°0′6.697″')
  })

  it('position', function () {
    // Example 23.a, p. 152
    var jd = julian.CalendarGregorianToJD(2028, 11, 13.19)
    var eq = new coord.Equatorial(
      new sexa.RA(2, 44, 11.986).rad(),
      new sexa.Angle(false, 49, 13, 42.48).rad()
    )
    var eqTo = apparent.position(eq, 2000, base.JDEToJulianYear(jd),
      new sexa.HourAngle(false, 0, 0, 0.03425).rad(),
      new sexa.Angle(true, 0, 0, 0.0895).rad()
    )
    assert.equal(new sexa.RA(eqTo.ra).toString(3), '2ʰ46ᵐ14.39ˢ')
    assert.equal(new sexa.Angle(eqTo.dec).toString(2), '49°21′7.45″')
  })

  it('aberrationRonVondrak', function () {
    // Example 23.b, p. 156
    var α = new sexa.RA(2, 44, 12.9747).rad()
    var δ = new sexa.Angle(false, 49, 13, 39.896).rad()
    var jd = julian.CalendarGregorianToJD(2028, 11, 13.19)
    var res = apparent.aberrationRonVondrak(α, δ, jd)
    assert.equal(res[0].toFixed(9), '0.000145252') // radian
    assert.equal(res[1].toFixed(9), '0.000032723') // radian
  })

  it('positionRonVondrak', function () {
    // Example 23.b, p. 156
    var jd = julian.CalendarGregorianToJD(2028, 11, 13.19)
    var eq = new coord.Equatorial(
      new sexa.RA(2, 44, 11.986).rad(),
      new sexa.Angle(false, 49, 13, 42.48).rad()
    )
    var eqTo = apparent.positionRonVondrak(
      eq, base.JDEToJulianYear(jd),
      new sexa.HourAngle(false, 0, 0, 0.03425),
      new sexa.Angle(true, 0, 0, 0.0895)
    )
    assert.equal(new sexa.RA(eqTo.ra).toString(3), '2ʰ46ᵐ14.392ˢ')
    assert.equal(new sexa.Angle(eqTo.dec).toString(2), '49°21′7.45″')
  })
})
