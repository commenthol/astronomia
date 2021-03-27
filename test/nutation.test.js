import assert from 'assert'
import { nutation, julian, sexagesimal as sexa } from '../src/index.js'

describe('#nutation', function () {
  it('Nutation', function () {
    // Example 22.a, p. 148.
    const jd = julian.CalendarGregorianToJD(1987, 4, 10)
    const _nu = nutation.nutation(jd)
    const Δψ = _nu[0]
    const Δε = _nu[1]
    const ε0 = nutation.meanObliquity(jd)
    const ε = ε0 + Δε
    // -3″.788
    assert.strictEqual(new sexa.Angle(Δψ).toString(2), '-0°0′3.79″')
    // +9″.443
    assert.strictEqual(new sexa.Angle(Δε).toString(2), '0°0′9.44″')
    // 23°26′27″.407
    assert.strictEqual(new sexa.Angle(ε0).toString(2), '23°26′27.41″')
    // 23°26′36″.850
    assert.strictEqual(new sexa.Angle(ε).toString(2), '23°26′36.85″')
  })

  it('ApproxNutation', function () {
    const jd = julian.CalendarGregorianToJD(1987, 4, 10)
    const _nu = nutation.approxNutation(jd)
    const Δψ = _nu[0]
    const Δε = _nu[1]
    // -3″.788
    assert.strictEqual(new sexa.Angle(Δψ).toString(2), '-0°0′3.86″')
    assert.ok(Math.abs(Δψ * (180 / Math.PI) * 3600 + 3.788) < 0.5)
    // +9″.443
    assert.strictEqual(new sexa.Angle(Δε).toString(2), '0°0′9.47″')
    assert.ok(Math.abs(Δε * (180 / Math.PI) * 3600 - 9.443) < 0.1)
  })

  it('NutationInRA', function () {
    const jd = julian.CalendarGregorianToJD(1987, 4, 10)
    const a = nutation.nutationInRA(jd)
    assert.strictEqual(a, -0.000016848469493116356)
  })

  it('IAUvsLaskar', function () {
    ;[1000, 2000, 3000].forEach(function (y) {
      const jd = julian.CalendarGregorianToJD(y, 0, 0)
      const i = nutation.meanObliquity(jd)
      const l = nutation.meanObliquityLaskar(jd)
      assert.ok(Math.abs(i - l) * (180 / Math.PI) * 3600 < 1, y)
    })

    ;[0, 4000].forEach(function (y) {
      const jd = julian.CalendarGregorianToJD(y, 0, 0)
      const i = nutation.meanObliquity(jd)
      const l = nutation.meanObliquityLaskar(jd)
      assert.ok(Math.abs(i - l) * (180 / Math.PI) * 3600 < 10, y)
    })
  })
})
