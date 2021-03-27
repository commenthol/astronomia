import assert from 'assert'
import float from './support/float.js'
import { eclipse } from '../src/index.js'

describe('#eclipse', function () {
  it('Solar 1993', function () {
    // Example 54.a, p. 384.0
    const res = eclipse.solar(1993.38)
    const exp = {
      type: eclipse.TYPE.Partial,
      central: false,
      jdeMax: 2449129.0978,
      magnitude: 0.74,
      distance: 1.1348,
      umbral: 0.0097,
      penumbral: 0.5558
    }

    assert.strictEqual(res.type, exp.type)
    assert.strictEqual(res.central, exp.central)
    if (res.type === eclipse.TYPE.Partial) {
      assert.strictEqual(float(res.magnitude).toFixed(2), exp.magnitude)
    }
    assert.strictEqual(float(res.jdeMax).toFixed(4), exp.jdeMax)
    assert.strictEqual(float(res.distance).toFixed(4), exp.distance)
    assert.strictEqual(float(res.umbral).toFixed(4), exp.umbral)
    assert.strictEqual(float(res.penumbral).toFixed(4), exp.penumbral)

    // Partial eclipse
    // Partial eclipse magnitude:       0.740
    // Non-central
    // Time of maximum eclipse:  2449129.0978
    // Minimum distance, γ:           +1.1348
    // Umbral radius, u:              +0.0097
    // Penumbral radius:              +0.5558
  })

  it('Solar 2009', function () {
    // Example 54.b, p. 385.0
    const res = eclipse.solar(2009.56)
    const exp = {
      type: eclipse.TYPE.Total,
      central: true,
      jdeMax: 2455034.6088,
      magnitude: undefined,
      distance: 0.0695,
      umbral: -0.0157,
      penumbral: 0.5304
    }

    assert.strictEqual(res.type, exp.type)
    assert.strictEqual(res.central, exp.central)
    if (res.type === eclipse.TYPE.Partial) {
      assert.strictEqual(float(res.magnitude).toFixed(2), exp.magnitude)
    }
    assert.strictEqual(float(res.jdeMax).toFixed(4), exp.jdeMax)
    assert.strictEqual(float(res.distance).toFixed(4), exp.distance)
    assert.strictEqual(float(res.umbral).toFixed(4), exp.umbral)
    assert.strictEqual(float(res.penumbral).toFixed(4), exp.penumbral)

    // Total eclipse
    // Central
    // Time of maximum eclipse:  2455034.6088
    // Minimum distance, γ:           +0.0695
    // Umbral radius, u:              -0.0157
    // Penumbral radius:              +0.5304
  })

  it('Lunar 1973', function () {
    // Example 54.c, p. 385.0
    const res = eclipse.lunar(1973.46)
    const exp = {
      type: eclipse.TYPE.Penumbral,
      magnitude: 0.4625,
      jdeMax: 2441849.3687,
      distance: -1.3249,
      umbral: 0.7206,
      penumbral: 1.3045,
      sdTotal: undefined,
      sdPartial: undefined,
      sdPenumbral: float(101.5 / 24 / 60).toFixed(4) // 101.5 min
    }

    assert.strictEqual(res.type, exp.type)
    assert.strictEqual(float(res.magnitude).toFixed(4), exp.magnitude) // Partial eclipse magnitude
    assert.strictEqual(float(res.jdeMax).toFixed(4), exp.jdeMax) // Time of maximum eclipse
    assert.strictEqual(float(res.distance).toFixed(4), exp.distance) // Minimum distance
    if (res.type >= eclipse.TYPE.Umbral) {
      assert.strictEqual(float(res.umbral).toFixed(4), exp.umbral) // Umbral radius
    }
    assert.strictEqual(float(res.penumbral).toFixed(4), exp.penumbral) // Penumbral radius

    /* eslint-disable no-fallthrough */
    switch (res.type) {
      case eclipse.TYPE.Total:
        assert.strictEqual(float(res.sdTotal).toFixed(4), exp.sdTotal) // semiduration in min
      case eclipse.TYPE.Umbral:
        assert.strictEqual(float(res.sdPartial).toFixed(4), exp.sdPartial)
      default:
        assert.strictEqual(float(res.sdPenumbral).toFixed(4), exp.sdPenumbral)
    }
    /* eslint-enable */

    // Penumbral eclipse
    // Magnitude:                     +0.4625
    // Time of maximum eclipse:  2441849.3687
    // Minimum distance, γ:           -1.3249
    // Penumbral radius, ρ:           +1.3045
    // Penumbral semiduration:        101 min
  })

  it('Lunar 1997', function () {
    // Example 54.d, p. 386.0
    const res = eclipse.lunar(1997.7)
    const exp = {
      type: eclipse.TYPE.Total,
      magnitude: 1.1868,
      jdeMax: 2450708.2835,
      distance: -0.3791,
      umbral: +0.7534,
      penumbral: +1.2717,
      sdTotal: float(30.384 / 24 / 60).toFixed(4), // in min
      sdPartial: float(97.632 / 24 / 60).toFixed(4), // in min
      sdPenumbral: float(153.36 / 24 / 60).toFixed(4) // in min
    }

    assert.strictEqual(res.type, exp.type)
    assert.strictEqual(float(res.magnitude).toFixed(4), exp.magnitude) // Partial eclipse magnitude
    assert.strictEqual(float(res.jdeMax).toFixed(4), exp.jdeMax) // Time of maximum eclipse
    assert.strictEqual(float(res.distance).toFixed(4), exp.distance) // Minimum distance
    if (res.type >= eclipse.TYPE.Umbral) {
      assert.strictEqual(float(res.umbral).toFixed(4), exp.umbral) // Umbral radius
    }
    assert.strictEqual(float(res.penumbral).toFixed(4), exp.penumbral) // Penumbral radius

    /* eslint-disable no-fallthrough */
    switch (res.type) {
      case eclipse.TYPE.Total:
        assert.strictEqual(float(res.sdTotal).toFixed(4), exp.sdTotal) // semiduration in min
      case eclipse.TYPE.Umbral:
        assert.strictEqual(float(res.sdPartial).toFixed(4), exp.sdPartial)
      default:
        assert.strictEqual(float(res.sdPenumbral).toFixed(4), exp.sdPenumbral)
    }
    /* eslint-enable */

    // Total eclipse
    // Magnitude:                     +1.1868
    // Time of maximum eclipse:  2450708.2835
    // Minimum distance, γ:           -0.3791
    // Umbral radius, σ:              +0.7534
    // Penumbral radius, ρ:           +1.2717
    // Totality semiduration:          30 min
    // Partial phase semiduration:     98 min
    // Penumbral semiduration:        153 min
  })

  describe('issue14', function () {
    it('eclipse.solar shall not return undefined', function () {
      const decimalYear = 2019.0900790352
      const solar = eclipse.solar(decimalYear)
      assert.strictEqual(typeof solar, 'object')
      assert.strictEqual(solar.type, eclipse.TYPE.None)
    })

    it('eclipse.lunar shall not throw', function () {
      const decimalYear = 2019.0900790352
      const lunar = eclipse.lunar(decimalYear)
      assert.ok(lunar)
    })

    it('eclipse.lunar shall not return undefined', function () {
      const decimalYear = 2019.9
      const lunar = eclipse.lunar(decimalYear)
      assert.strictEqual(typeof lunar, 'object')
      assert.strictEqual(lunar.type, eclipse.TYPE.None)
    })
  })
})
