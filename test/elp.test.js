import assert from 'assert'
import float from './support/float.js'
import { elp, julian, sexagesimal as sexa } from '../src/index.js'
import data from '../data/index.js'

const R2D = 180 / Math.PI

describe('#elp', function () {
  it('position XYZ', function () {
    // data test from ftp://cyrano-se.obspm.fr/pub/2_lunar_solutions/2_elpmpp02/elpmpp02.pdf
    const dataTest = [
      { JD: 2500000.5, X: 274034.59103, Y: 252067.53689, Z: -18998.75519 },
      { JD: 2300000.5, X: 353104.31359, Y: -195254.11808, Z: 34943.54592 },
      { JD: 2100000.5, X: -19851.27674, Y: -385646.17717, Z: -27597.66134 },
      { JD: 1900000.5, X: -370342.79254, Y: -37574.25533, Z: -4527.91840 },
      { JD: 1700000.5, X: -164673.04720, Y: 367791.71329, Z: 31603.98027 }
    ]
    const moon = new elp.Moon(data.elpMppDeFull)
    dataTest.forEach(function (row) {
      const { x, y, z } = moon.positionXYZ(row.JD)
      assert.strictEqual(float(x).toFixed(4), float(row.X).toFixed(4))
      assert.strictEqual(float(y).toFixed(4), float(row.Y).toFixed(4))
      assert.strictEqual(float(z).toFixed(4), float(row.Z).toFixed(4))
    })
  })

  it('position', function () {
    // Example 47.a, p. 342.
    const Δψ = 0.004610 / R2D
    const jde = julian.CalendarGregorianToJD(1992, 4, 12)
    const moon = new elp.Moon(data.elpMppDeFull)
    const τ = moon.lightTime(jde)
    const res = moon.position(jde - τ)
    assert.strictEqual(new sexa.Angle(res.lon + Δψ).toString(0), '133°10′0″')
    assert.strictEqual(new sexa.Angle(res.lat).toString(0), '-3°13′45″')
    assert.strictEqual(float(res.range).toFixed(1), 368405.6)
  })
})
