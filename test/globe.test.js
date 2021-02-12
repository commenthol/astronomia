import assert from 'assert'
import { base, globe, sexagesimal as sexa } from '../src/index.js'

describe('#globe', function () {
  it('parallaxConstants', function () {
    // Example 11.a, p 82.
    // phi = geographic latitude of Palomar
    const φ = new sexa.Angle(false, 33, 21, 22).rad()
    const res = globe.Earth76.parallaxConstants(φ, 1706)
    // ρ sin φ′ = +0.546861
    // ρ cos φ′ = +0.836339
    assert.deepStrictEqual(res, [0.5468608240604509, 0.8363392323525684])
  })

  it('geocentricLatitudeDifference', function () {
    // p. 83
    const φ0 = new sexa.Angle(false, 45, 5, 46.36).rad()
    const diff = globe.geocentricLatitudeDifference(φ0)
    const res = new sexa.Angle(diff).toString(2)
    assert.strictEqual(res, '0°11′32.73″')
  })

  describe('Radius functions', function () {
    let rp
    let rm
    let φ

    it('radiusAtLatitude', function () {
      // Example 11.b p 84.
      φ = 42 * Math.PI / 180
      rp = globe.Earth76.radiusAtLatitude(φ)
      // Rp = 4747.001 km
      assert.strictEqual(base.round(rp, 3), 4747.001)
    })

    it('RotationRate1996_5', function () {
      const ωRp = rp * globe.RotationRate1996_5
      // linear velocity = ωRp = 0.34616 km/second
      assert.strictEqual(base.round(ωRp, 5), 0.34616)
    })

    it('radiusOfCurvature', function () {
      rm = globe.Earth76.radiusOfCurvature(φ)
      // Rm = 6364.033 km
      assert.strictEqual(base.round(rm, 3), 6364.033)
    })

    it('oneDegreeOfLongitude', function () {
      // 1° of longitude = 82.8508 km
      assert.strictEqual(base.round(globe.oneDegreeOfLongitude(rp), 4), 82.8508)
    })

    it('oneDegreeOfLatitude', function () {
      // 1° of latitude = 111.0733 km
      assert.strictEqual(base.round(globe.oneDegreeOfLatitude(rm), 4), 111.0733)
    })
  })

  describe('distance functions', function () {
    // Example 11.c p 85.
    const c1 = new globe.Coord(
      new sexa.Angle(false, 48, 50, 11).rad(), // geographic latitude
      new sexa.Angle(true, 2, 20, 14).rad() // geographic longitude
    )
    const c2 = new globe.Coord(
      new sexa.Angle(false, 38, 55, 17).rad(), // lat
      new sexa.Angle(false, 77, 3, 56).rad() // lon
    )
    let d

    it('distance', function () {
      // 6181.63 km
      const distance = globe.Earth76.distance(c1, c2)
      assert.strictEqual(base.round(distance, 2), 6181.63)
    })

    it('approxAngularDistance', function () {
      const cos = globe.approxAngularDistance(c1, c2)
      d = Math.acos(cos)
      // cos d = 0.567146
      assert.strictEqual(base.round(cos, 6), 0.567146)
      //     d = 55°.44855
      assert.strictEqual(new sexa.Angle(d).toString(2), '55°26′54.77″')
    })

    it('approxLinearDistance', function () {
      const lindist = globe.approxLinearDistance(d)
      //     s = 6166 km
      assert.strictEqual(base.round(lindist, 0), 6166)
    })
  })
})
