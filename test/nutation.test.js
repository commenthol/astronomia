import assert from 'assert'
import {nutation, julian, sexagesimal as sexa} from '..'

describe('#nutation', function () {
  it('Nutation', function () {
    // Example 22.a, p. 148.
    var jd = julian.CalendarGregorianToJD(1987, 4, 10)
    var _nu = nutation.nutation(jd)
    var Δψ = _nu[0]
    var Δε = _nu[1]
    var ε0 = nutation.meanObliquity(jd)
    var ε = ε0 + Δε
    // -3″.788
    assert.equal(new sexa.Angle(Δψ).toString(2), '-0°0′3.79″')
    // +9″.443
    assert.equal(new sexa.Angle(Δε).toString(2), '0°0′9.44″')
    // 23°26′27″.407
    assert.equal(new sexa.Angle(ε0).toString(2), '23°26′27.41″')
    // 23°26′36″.850
    assert.equal(new sexa.Angle(ε).toString(2), '23°26′36.85″')
  })

  it('ApproxNutation', function () {
    var jd = julian.CalendarGregorianToJD(1987, 4, 10)
    var _nu = nutation.approxNutation(jd)
    var Δψ = _nu[0]
    var Δε = _nu[1]
    // -3″.788
    assert.equal(new sexa.Angle(Δψ).toString(2), '-0°0′3.86″')
    assert.ok(Math.abs(Δψ * (180 / Math.PI) * 3600 + 3.788) < 0.5)
    // +9″.443
    assert.equal(new sexa.Angle(Δε).toString(2), '0°0′9.47″')
    assert.ok(Math.abs(Δε * (180 / Math.PI) * 3600 - 9.443) < 0.1)
  })

  it('NutationInRA', function () {
    var jd = julian.CalendarGregorianToJD(1987, 4, 10)
    var a = nutation.nutationInRA(jd)
    assert.equal(a, -0.000016848469493116356)
  })

  it('IAUvsLaskar', function () {
    ;[1000, 2000, 3000].forEach(function (y) {
      var jd = julian.CalendarGregorianToJD(y, 0, 0)
      var i = nutation.meanObliquity(jd)
      var l = nutation.meanObliquityLaskar(jd)
      assert.ok(Math.abs(i - l) * (180 / Math.PI) * 3600 < 1, y)
    })

    ;[0, 4000].forEach(function (y) {
      var jd = julian.CalendarGregorianToJD(y, 0, 0)
      var i = nutation.meanObliquity(jd)
      var l = nutation.meanObliquityLaskar(jd)
      assert.ok(Math.abs(i - l) * (180 / Math.PI) * 3600 < 10, y)
    })
  })
})
