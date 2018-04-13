import assert from 'assert'
import {parallax, base, julian, moonposition, sidereal, globe, sexagesimal as sexa} from '..'

var D2R = Math.PI / 180
var R2D = 180 / Math.PI
var RAD2SEC = R2D * 3600
var SEC2RAD = D2R / 3600

describe('#parallax', function () {
  it('horizontal', function () {
    // Example 40.a, p. 280
    var π = parallax.horizontal(0.37276) // in radians
    assert.equal((π * RAD2SEC).toFixed(3), 23.592)
  })

  it('horizontal from moonposition', function () {
    // example from moonposition.parallax, ch 47, p. 342
    var jd = julian.CalendarGregorianToJD(1992, 4, 12)
    var range = moonposition.position(jd).range
    var πMoon = moonposition.parallax(range) * R2D // degrees
    var π = parallax.horizontal(range / base.AU) * R2D // degrees
    var want = 0.991973
    // we don't quite get all the digits here.
    // for close objects we need that Arcsin that's in moonposition.Parallax.
    assert.ok(Math.abs(π - πMoon) < 0.001, want)
  })

  describe('RA, Dec of Mars', function () {
    // UT at Palomar Observatory on '2003-08-28T03:17:00Z'
    var jd = julian.CalendarGregorianToJD(2003, 8, 28 + new sexa.Time(false, 3, 17, 0).day())
    // lat = 33°.356; lon = 116°.8625; altitude = 1706
    var lat = new sexa.Angle(false, 33, 21, 22).rad()
    var lon = new sexa.HourAngle(false, 7, 47, 27).rad()
    var alt = 1706
    // var ρsφʹ = 0.546861
    // var ρcφʹ = 0.836339
    var [ρsφʹ, ρcφʹ] = globe.Earth76.parallaxConstants(lat, alt)
    // Mars geocentric apparent equatorial coordinates at `jd`
    var α = 339.530208 * D2R
    var δ = -15.771083 * D2R
    var Δ = 0.37276
    var marsCoord = new base.Coord(α, δ, Δ)

    it('topocentric', function () {
      // Example 40.a, p. 280
      var a = parallax.topocentric(marsCoord, ρsφʹ, ρcφʹ, lon, jd)
      var α = a.ra
      var δ = a.dec
      assert.equal(new sexa.RA(α).toString(2), '22ʰ38ᵐ8.54ˢ')
      assert.equal(new sexa.Angle(δ).toString(1), '-15°46′30″')
    })

    it('topocentric2', function () {
      // Example 40.a, p. 280
      var a = parallax.topocentric2(marsCoord, ρsφʹ, ρcφʹ, lon, jd)
      var Δα = a.ra
      var Δδ = a.dec
      assert.equal((Δα * RAD2SEC / 15).toFixed(2), 1.29) // 1.29 sec of RA
      assert.equal((Δδ * RAD2SEC).toFixed(1), -14.1) // -14.1 sec
    })

    it('topocentric3', function () {
      // same test case as example 40.a, p. 280
      // reference result
      var a = parallax.topocentric(marsCoord, ρsφʹ, ρcφʹ, lon, jd)
      var αʹ = a.ra
      var δʹ1 = a.dec
      // result to test
      a = parallax.topocentric3(marsCoord, ρsφʹ, ρcφʹ, lon, jd)
      var Hʹ = a[0]
      var δʹ3 = a[1]
      // test
      var θ0 = new sexa.Time(sidereal.apparent(jd)).rad()
      var err = Math.abs(base.pmod(Hʹ - (θ0 - lon - αʹ) + 1, 2 * Math.PI) - 1)
      assert.ok(err < 1e-15)
      assert.ok(Math.abs(δʹ3 - δʹ1) < 1e-15)
    })
  })

  it('topocentricEcliptical', function () {
    // exercise, p. 282
    var a = parallax.topocentricEcliptical(
      new base.Coord(
        new sexa.Angle(false, 181, 46, 22.5).rad(),
        new sexa.Angle(false, 2, 17, 26.2).rad()
      ),
      new sexa.Angle(false, 0, 16, 15.5).rad(),
      new sexa.Angle(false, 50, 5, 7.8).rad(), 0,
      new sexa.Angle(false, 23, 28, 0.8).rad(),
      new sexa.Angle(false, 209, 46, 7.9).rad(),
      new sexa.Angle(false, 0, 59, 27.7).rad()
    )
    var λʹ = a[0]
    var βʹ = a[1]
    var sʹ = a[2]
    var λʹa = new sexa.Angle(false, 181, 48, 5).rad()
    var βʹa = new sexa.Angle(false, 1, 29, 7.1).rad()
    var sʹa = new sexa.Angle(false, 0, 16, 25.5).rad()
    var err = Math.abs(λʹ - λʹa)
    assert.ok(err < 0.1 * SEC2RAD)
    err = Math.abs(βʹ - βʹa)
    assert.ok(err < 0.1 * SEC2RAD)
    err = Math.abs(sʹ - sʹa)
    assert.ok(err < 0.1 * SEC2RAD)
  })
})
