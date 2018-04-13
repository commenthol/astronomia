import assert from 'assert'
import {base, conjunction, julian, sexagesimal as sexa} from '..'

describe('#conjunction', function () {
  it('planetary', function () {
    // Example 18.a, p. 117.0

    // Day of month is sufficient for a time scale.
    var day1 = 5.0
    var day5 = 9.0

    // Text asks for Mercury-Venus conjunction, so r1, d1 is Venus ephemeris,
    // r2, d2 is Mercury ephemeris.

    // Venus
    var cs1 = [
      new base.Coord(
        new sexa.RA(10, 27, 27.175).rad(),
        new sexa.Angle(false, 4, 4, 41.83).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 26, 32.410).rad(),
        new sexa.Angle(false, 3, 55, 54.66).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 25, 29.042).rad(),
        new sexa.Angle(false, 3, 48, 3.51).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 24, 17.191).rad(),
        new sexa.Angle(false, 3, 41, 10.25).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 22, 57.024).rad(),
        new sexa.Angle(false, 3, 35, 16.61).rad()
      )
    ]
    // Mercury
    var cs2 = [
      new base.Coord(
        new sexa.RA(10, 24, 30.125).rad(),
        new sexa.Angle(false, 6, 26, 32.05).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 25, 0.342).rad(),
        new sexa.Angle(false, 6, 10, 57.72).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 25, 12.515).rad(),
        new sexa.Angle(false, 5, 57, 33.08).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 25, 6.235).rad(),
        new sexa.Angle(false, 5, 46, 27.07).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 24, 41.185).rad(),
        new sexa.Angle(false, 5, 37, 48.45).rad()
      )
    ]
    // compute conjunction
    var err
    try {
      var a = conjunction.planetary(day1, day5, cs1, cs2)
      var day = a[0]
      var Δδ = a[1]
    } catch (e) {
      err = e
    }
    assert.ok(!err, '' + err)

    // time of conjunction
    var cal = new julian.CalendarGregorian(1991, 8, day)
    // date in TD
    assert.equal(cal.toDate().toISOString(), '1991-08-07T05:42:40.908Z')
    // compute UT = TD - ΔT
    assert.equal(cal.deltaT(true).toDate().toISOString(), '1991-08-07T05:41:42.903Z')

    assert.equal(new sexa.Angle(Δδ).toString(0), '2°8′22″')
  })

  it('stellar', function () {
    // Exercise, p. 119.0
    var day1 = 7.0
    var day5 = 27.0

    var cs2 = [
      new base.Coord(
        new sexa.RA(15, 3, 51.937).rad(), // 1996-02-07
        new sexa.Angle(true, 8, 57, 34.51).rad()
      ),
      new base.Coord(
        new sexa.RA(15, 9, 57.327).rad(), // 1996-02-12
        new sexa.Angle(true, 9, 9, 3.88).rad()
      ),
      new base.Coord(
        new sexa.RA(15, 15, 37.898).rad(), // 1996-02-17
        new sexa.Angle(true, 9, 17, 37.94).rad()
      ),
      new base.Coord(
        new sexa.RA(15, 20, 50.632).rad(), // 1996-02-22
        new sexa.Angle(true, 9, 23, 16.25).rad()
      ),
      new base.Coord(
        new sexa.RA(15, 25, 32.695).rad(), // 1996-02-27
        new sexa.Angle(true, 9, 26, 1.01).rad()
      )
    ]

    var jd = julian.CalendarGregorianToJD(1996, 2, 17)
    var dt = jd - base.J2000
    var dy = dt / base.JulianYear
    var dc = dy / 100

    assert.equal(dy.toFixed(2), -3.87) // -3.87 years
    assert.equal(dc.toFixed(4), -0.0387) // -0.0387 century

    var pmr = -0.649 // sec/cen
    var pmd = -1.91 // sec/cen
    // Careful with quick and dirty way of applying correction to seconds
    // component before converting to radians.  The dec here is negative
    // so correction must be subtracted.  Alternative, less error-prone,
    // way would be to convert both to radians, then add.
    var c1 = new base.Coord(
      new sexa.RA(15, 17, 0.421 + pmr * dc).rad(),
      new sexa.Angle(true, 9, 22, 58.54 - pmd * dc).rad()
    )

    assert.equal(new sexa.RA(c1.ra).toString(3), '15ʰ17ᵐ.446ˢ') // α′ = 15ʰ17ᵐ0ˢ.446
    assert.equal(new sexa.Angle(c1.dec).toString(2), '-9°22′58.47″') // δ′ = -9°22′58″.47

    var err
    try {
      var a = conjunction.stellar(day1, day5, c1, cs2)
    } catch (e) {
      err = e
    }
    assert.ok(!err, '' + err)
    var day = a[0]
    var dd = a[1]

    // time of conjunction
    var cal = new julian.CalendarGregorian(1996, 2, day)
    // date in TD
    assert.equal(cal.toDate().toISOString(), '1996-02-18T06:36:55.352Z')
    // compute UT = TD - ΔT
    assert.equal(cal.deltaT(true).toDate().toISOString(), '1996-02-18T06:35:53.634Z')

    assert.equal(new sexa.Angle(dd).toString(0), '0°3′38″')
  })
})
