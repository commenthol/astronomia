import assert from 'assert'
import float from './support/float.js'
import { parallax, base, julian, moonposition, sidereal, globe, sexagesimal as sexa } from '../src/index.js'

const D2R = Math.PI / 180
const R2D = 180 / Math.PI
const RAD2SEC = R2D * 3600
const SEC2RAD = D2R / 3600

describe('#parallax', function () {
  it('horizontal', function () {
    // Example 40.a, p. 280
    const π = parallax.horizontal(0.37276) // in radians
    assert.strictEqual(float(π * RAD2SEC).toFixed(3), 23.592)
  })

  it('horizontal from moonposition', function () {
    // example from moonposition.parallax, ch 47, p. 342
    const jd = julian.CalendarGregorianToJD(1992, 4, 12)
    const range = moonposition.position(jd).range
    const πMoon = moonposition.parallax(range) * R2D // degrees
    const π = parallax.horizontal(range / base.AU) * R2D // degrees
    const want = 0.991973
    // we don't quite get all the digits here.
    // for close objects we need that Arcsin that's in moonposition.Parallax.
    assert.ok(Math.abs(π - πMoon) < 0.001, want)
  })

  describe('RA, Dec of Mars', function () {
    // UT at Palomar Observatory on '2003-08-28T03:17:00Z'
    const jd = julian.CalendarGregorianToJD(2003, 8, 28 + new sexa.Time(false, 3, 17, 0).day())
    // lat = 33°.356; lon = 116°.8625; altitude = 1706
    const lat = new sexa.Angle(false, 33, 21, 22).rad()
    const lon = new sexa.HourAngle(false, 7, 47, 27).rad()
    const alt = 1706
    // let ρsφʹ = 0.546861
    // let ρcφʹ = 0.836339
    const [ρsφʹ, ρcφʹ] = globe.Earth76.parallaxConstants(lat, alt)
    // Mars geocentric apparent equatorial coordinates at `jd`
    const α = 339.530208 * D2R
    const δ = -15.771083 * D2R
    const Δ = 0.37276
    const marsCoord = new base.Coord(α, δ, Δ)

    it('topocentric', function () {
      // Example 40.a, p. 280
      const a = parallax.topocentric(marsCoord, ρsφʹ, ρcφʹ, lon, jd)
      const α = a.ra
      const δ = a.dec
      assert.strictEqual(new sexa.RA(α).toString(2), '22ʰ38ᵐ8.54ˢ')
      assert.strictEqual(new sexa.Angle(δ).toString(1), '-15°46′30″')
    })

    it('topocentric2', function () {
      // Example 40.a, p. 280
      const a = parallax.topocentric2(marsCoord, ρsφʹ, ρcφʹ, lon, jd)
      const Δα = a.ra
      const Δδ = a.dec
      assert.strictEqual(float(Δα * RAD2SEC / 15).toFixed(2), 1.29) // 1.29 sec of RA
      assert.strictEqual(float(Δδ * RAD2SEC).toFixed(1), -14.1) // -14.1 sec
    })

    it('topocentric3', function () {
      // same test case as example 40.a, p. 280
      // reference result
      let a = parallax.topocentric(marsCoord, ρsφʹ, ρcφʹ, lon, jd)
      const αʹ = a.ra
      const δʹ1 = a.dec
      // result to test
      a = parallax.topocentric3(marsCoord, ρsφʹ, ρcφʹ, lon, jd)
      const Hʹ = a[0]
      const δʹ3 = a[1]
      // test
      const θ0 = new sexa.Time(sidereal.apparent(jd)).rad()
      const err = Math.abs(base.pmod(Hʹ - (θ0 - lon - αʹ) + 1, 2 * Math.PI) - 1)
      assert.ok(err < 1e-15)
      assert.ok(Math.abs(δʹ3 - δʹ1) < 1e-15)
    })
  })

  it('topocentricEcliptical', function () {
    // exercise, p. 282
    const a = parallax.topocentricEcliptical(
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
    const λʹ = a[0]
    const βʹ = a[1]
    const sʹ = a[2]
    const λʹa = new sexa.Angle(false, 181, 48, 5).rad()
    const βʹa = new sexa.Angle(false, 1, 29, 7.1).rad()
    const sʹa = new sexa.Angle(false, 0, 16, 25.5).rad()
    let err = Math.abs(λʹ - λʹa)
    assert.ok(err < 0.1 * SEC2RAD)
    err = Math.abs(βʹ - βʹa)
    assert.ok(err < 0.1 * SEC2RAD)
    err = Math.abs(sʹ - sʹa)
    assert.ok(err < 0.1 * SEC2RAD)
  })
})
