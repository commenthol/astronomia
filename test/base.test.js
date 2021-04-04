import assert from 'assert'
import float from './support/float.js'
import { base } from '../src/index.js'

describe('#base', function () {
  describe('constants', function () {
    it('lightTime', function () {
      const res = base.lightTime(0.910845)
      assert.strictEqual(res, 0.0052606019659635)
    })
  })

  describe('julian', function () {
    it('JulianYearToJDE J2000', function () {
      const res = base.JulianYearToJDE(2000)
      assert.strictEqual(res, base.J2000)
    })

    it('JulianYearToJDE J2050', function () {
      const res = Math.abs((base.JulianYearToJDE(2050) - 2469807.5) / 2469807.5) < 1e-15
      assert.ok(res)
    })

    it('JDEToJulianYear', function () {
      const tmp = base.JulianYearToJDE(2000)
      const res = base.JDEToJulianYear(tmp)
      assert.strictEqual(res, 2000)
    })

    it('BesselianYearToJDE B1900', function () {
      const res = base.BesselianYearToJDE(1900)
      assert.strictEqual(res, base.B1900)
    })

    it('BesselianYearToJDE B1950', function () {
      const res = Math.abs(base.BesselianYearToJDE(1950) - 2433282.4235) < 1e-4
      assert.ok(res)
    })

    it('JDEToBesselianYear', function () {
      const tmp = base.BesselianYearToJDE(1900)
      const res = base.JDEToBesselianYear(tmp)
      assert.strictEqual(res, 1900)
    })

    it('J2000Century', function () {
      const res = base.J2000Century(0)
      assert.strictEqual(res, -67.11964407939767)
    })
  })

  describe('math', function () {
    describe('general', function () {
      it('toRad toDeg', function () {
        const deg = 90
        const res = base.toDeg(base.toRad(deg))
        assert.strictEqual(res, deg)
      })

      it('FloorDiv', function () {
        assert.strictEqual(base.floorDiv(+5, +3), 1)
        assert.strictEqual(base.floorDiv(-5, +3), -2)
        assert.strictEqual(base.floorDiv(+5, -3), -2)
        assert.strictEqual(base.floorDiv(-5, -3), 1)
        // exact divisors, no remainders
        assert.strictEqual(base.floorDiv(+6, +3), 2)
        assert.strictEqual(base.floorDiv(-6, +3), -2)
        assert.strictEqual(base.floorDiv(+6, -3), -2)
        assert.strictEqual(base.floorDiv(-6, -3), 2)
      })

      it('pmod', function () {
        assert.strictEqual(base.pmod(5, 3), 2)
        assert.strictEqual(float(base.pmod(3.123, 3)).toFixed(3), 0.123)
      })

      it('round', function () {
        assert.strictEqual(base.round(5 / 3, 0), 2)
        assert.strictEqual(base.round(5 / 3, 3), 1.667)
        // increased precision
        assert.strictEqual(base.round(5 / 3, 5), 1.66667)
        assert.strictEqual(base.round(-5 / 3), -1.66666666666667)
      })
    })

    describe('Trigonometric functions of large angles', function () {
      const large = 36000030

      it('direct', function () {
        // The direct function call loses precision as expected.
        const res = Math.sin(base.toRad(large))
        assert.strictEqual(base.round(res), base.round(0.49999999995724154))
      })

      it('mathMod', function () {
        // Math.Mod takes float64s and returns float64s.  The integer constants
        // here however can be represented exactly as float64s, and the returned
        // result is exact as well.
        const res = large % 360
        assert.strictEqual(res, 30)
      })

      it('sinMod', function () {
        // But when math.Mod is substituted into the Sin function, float64s
        // are multiplied instead of the high precision constants, and the result
        // comes back slightly inexact.
        const res = Math.sin(base.toRad(large % 360))
        assert.strictEqual(res, 0.49999999999999994)
      })

      it('PModint', function () {
        // Use of PMod on integer constants produces results identical to above.
        const res = Math.sin(base.toRad(base.pmod(large, 360)))
        assert.strictEqual(res, 0.49999999999999994)
      })

      it('PModFloat', function () {
        // As soon as the large integer is scaled to a non-integer value though,
        // precision is lost and PMod is of no help recovering at this point.
        const res = Math.sin(base.pmod(base.toRad(large), 2 * Math.PI))
        assert.strictEqual(res, 0.49999999997845307)
      })
    })

    describe('Trigonometric functions of large angles (mars)', function () {
      const W = 5492522.4593
      const reduced = 2.4593

      it('Direct', function () {
        // Direct function call.  It's a number.  How correct is it?
        const res = Math.sin(base.toRad(W))
        // assert.strictEqual(res, 0.04290970350270464) // Go
        assert.strictEqual(base.round(res), base.round(0.04290970351724315))
      })

      it('Reduced', function () {
        // Manually reduced to range 0-360.  This is presumably the "correct"
        // answer, but note that the reduced number has a reduced number of
        // significat digits.  The answer cannot have any more significant digits.
        const res = Math.sin(base.toRad(reduced))
        // assert.strictEqual(res, 0.04290970350923273) // Go
        assert.strictEqual(res, 0.042909703509232726)
      })

      it('PMod deg', function () {
        // Accordingly, PMod cannot rescue any precision, whether done on degrees
        // or radians.
        const res = Math.sin(base.pmod(W, 360) * Math.PI / 180)
        assert.strictEqual(res, 0.04290970351307828)
      })

      it('PMod rad', function () {
        const res = Math.sin(base.pmod(W * Math.PI / 180, 2 * Math.PI))
        // assert.strictEqual(res, 0.04290970350643808) // Go
        assert.strictEqual(res, 0.042909703520976596)
      })
    })

    describe('Horner', function () {
      it('can evaluate f(x) = 2x³-6x²+2x-1 at x=3', function () {
        // Meeus gives no test case.
        // The test case here is from Wikipedia's entry on Horner's method.
        const res = base.horner(3, -1, 2, -6, 2)
        assert.strictEqual(res, 5)
      })

      it('can evaluate f(x) = 2x³-6x²+2x-1 at x=3 using array', function () {
        // Meeus gives no test case.
        // The test case here is from Wikipedia's entry on Horner's method.
        const res = base.horner(3, -1, 2, -6, 2)
        assert.strictEqual(res, 5)
      })
    })
  })

  describe('phase', function () {
    it('Illuminated Venus', function () {
      const res = base.illuminated(Math.acos(0.29312))
      assert.strictEqual(res, 0.64656)
    })

    it('Illuminated Moon', function () {
      // Example 48.a, p. 347.
      const res = base.illuminated(base.toRad(69.0756))
      assert.strictEqual(res, 0.6785679037959225)
    })

    it('Limb', function () {
      // Example 48.a, p. 347.
      const p = Math.PI / 180
      const χ = base.limb(
        new base.Coord(134.6885 * p, 13.7684 * p),
        new base.Coord(20.6579 * p, 8.6964 * p)
      )
      assert.strictEqual(χ / p, 285.04418687158426)
    })
  })
})
