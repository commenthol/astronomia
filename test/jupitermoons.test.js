import assert from 'assert'
import float from './support/float.js'
import { julian, jupitermoons, planetposition } from '../src/index.js'
import data from '../data/index.js'

describe('#jupitermoons', function () {
  describe('positions', function () {
    it('positions()', function () {
      const pos = jupitermoons.positions(2448972.50068)

      assert.strictEqual(float(pos[0].x).toFixed(2), -3.44)
      assert.strictEqual(float(pos[1].x).toFixed(2), +7.44)
      assert.strictEqual(float(pos[2].x).toFixed(2), +1.24)
      assert.strictEqual(float(pos[3].x).toFixed(2), +7.08)

      assert.strictEqual(float(pos[0].y).toFixed(2), +0.21)
      assert.strictEqual(float(pos[1].y).toFixed(2), +0.25)
      assert.strictEqual(float(pos[2].y).toFixed(2), +0.65)
      assert.strictEqual(float(pos[3].y).toFixed(2), +1.10)

      // Output:
      // X  -3.44  +7.44  +1.24  +7.08
      // Y  +0.21  +0.25  +0.65  +1.10
    })

    it('conjuction', function () {
      // Exercise, p. 314.
      // The exercise of finding the zero crossing is not coded here, but computed
      // are offsets at the times given by Meeus, showing the X coordinates near
      // zero (indicating conjunction) and Y coordinates near the values given by
      // Meeus.

      let jde = new julian.Calendar().fromDate(new Date('1988-11-23T07:28:00Z')).toJDE()
      const pos3 = jupitermoons.positions(jde)

      jde = new julian.Calendar().fromDate(new Date('1988-11-23T05:15:00Z')).toJDE()
      const pos4 = jupitermoons.positions(jde)

      assert.deepStrictEqual(xyToFixed(pos3[2]), {
        x: -0.0016,
        y: -0.8424
      })
      assert.deepStrictEqual(xyToFixed(pos4[3]), {
        x: +0.0555,
        y: +1.4811
      })

      // Output:
      // III  7ʰ28ᵐ  X = -0.00  Y = -0.84
      // IV   5ʰ15ᵐ  X = +0.06  Y = +1.48
    })
  })

  describe('e5 positions', function () {
    it('e5()', function () {
      const e = new planetposition.Planet(data.earth)
      const j = new planetposition.Planet(data.jupiter)
      const pos = jupitermoons.e5(2448972.50068, e, j)

      assert.strictEqual(float(pos[0].x).toFixed(4), -3.4503)
      assert.strictEqual(float(pos[1].x).toFixed(4), +7.4418)
      assert.strictEqual(float(pos[2].x).toFixed(4), +1.2010)
      assert.strictEqual(float(pos[3].x).toFixed(4), +7.0720)

      assert.strictEqual(float(pos[0].y).toFixed(4), +0.2137)
      assert.strictEqual(float(pos[1].y).toFixed(4), +0.2752)
      assert.strictEqual(float(pos[2].y).toFixed(4), +0.5900)
      assert.strictEqual(float(pos[3].y).toFixed(4), +1.0290)

      // Output:
      // X  -3.4503  +7.4418  +1.2010  +7.0720
      // Y  +0.2137  +0.2752  +0.5900  +1.0290
    })

    it('conjunction', function () {
      // Exercise, p. 314.
      // The exercise of finding the zero crossing is not coded here, but computed
      // are offsets at the times given by Meeus, showing the X coordinates near
      // zero (indicating conjunction) and Y coordinates near the values given by
      // Meeus.

      const e = new planetposition.Planet(data.earth)
      const j = new planetposition.Planet(data.jupiter)

      let jde = new julian.Calendar().fromDate(new Date('1988-11-23T07:28:00Z')).toJDE()
      const pos3 = jupitermoons.e5(jde, e, j)

      jde = new julian.Calendar().fromDate(new Date('1988-11-23T05:15:00Z')).toJDE()
      const pos4 = jupitermoons.e5(jde, e, j)

      assert.deepStrictEqual(xyToFixed(pos3[2]), {
        x: +0.0032,
        y: -0.8042
      })
      assert.deepStrictEqual(xyToFixed(pos4[3]), {
        x: +0.0002,
        y: +1.3990
      })

      // Output:
      // III  7ʰ28ᵐ  X = +0.0032  Y = -0.8042
      // IV   5ʰ15ᵐ  X = +0.0002  Y = +1.3990
    })
  })
})

function xyToFixed (xy, n) {
  n = n || 4
  return {
    x: float(xy.x).toFixed(n),
    y: float(xy.y).toFixed(n)
  }
}
