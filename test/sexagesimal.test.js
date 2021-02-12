import assert from 'assert'
import { sexagesimal as sexa } from '../src/index.js'

describe('#sexagesimal', function () {
  describe('functions', function () {
    it('DMSToDeg', function () {
      // Example p. 7.
      const res = sexa.DMSToDeg(false, 23, 26, 49)
      assert.strictEqual(res, 23.446944444444444)
    })
    it('DegToDMS', function () {
      // Example p. 7.
      const res = sexa.degToDMS(-23.446944444444444)
      assert.deepStrictEqual(res, [true, 23, 26, 49])
    })
  })

  describe('Angle', function () {
    it('negative', function () {
      // Example negative values, p. 9.
      const res = new sexa.Angle(true, 13, 47, 22)
      assert.strictEqual(res.deg(), -13.789444444444445)
      assert.strictEqual(res.toString(), '-13°47′22″')
      assert.strictEqual(res.toDegString(3), '-13°.789')
      assert.deepStrictEqual(res.toDMS(), [true, 13, 47, 22])
    })

    it('positive', function () {
      const res = new sexa.Angle(false, 0, 32, 41)
      assert.strictEqual(res.deg(), 0.5447222222222222)
      assert.strictEqual(res.toString(), '0°32′41″')
      assert.strictEqual(res.toDegString(5), '0°.54472')
      assert.deepStrictEqual(res.toDMS(), [false, 0, 32, 41])
    })

    it('positive #2', function () {
      const res = new sexa.Angle(false, 0, 0, 47.34)
      assert.strictEqual(res.deg(), 0.01315)
      assert.strictEqual(res.toString(), '0°0′47.34″')
    })

    it('new Angle with one argument', function () {
      const res = new sexa.Angle(0.5 * Math.PI)
      assert.strictEqual(res.deg(), 90)
      assert.strictEqual(res.toString(), '90°0′0″')
    })
  })

  describe('HourAngle', function () {
    const ha = new sexa.HourAngle(true, 12, 34, 45.6) // true means negative

    it('hour', function () {
      assert.strictEqual(ha.hour(), -12.579333333333334)
    })
    it('rad', function () {
      assert.strictEqual(ha.rad(), -3.2932617655881007)
    })
    it('deg', function () {
      assert.strictEqual(ha.deg(), -12.579333333333334)
    })
    it('toString', function () {
      assert.strictEqual(ha.toString(), '-12ʰ34ᵐ45.6ˢ')
    })
    it('toDegString', function () {
      assert.strictEqual(ha.toDegString(4), '-12°.5793')
    })
    it('toDMS', function () {
      assert.deepStrictEqual(ha.toDMS(), [true, 12, 34, 45.6])
    })
  })

  describe('RA', function () {
    const ra = new sexa.RA(9, 14, 55.8)

    it('Rad', function () {
      // Example 1.a, p. 8.
      const res = Math.tan(ra.rad())
      assert.strictEqual(res, -0.8775169448762477)
    })
    it('Deg', function () {
      const res = ra.deg()
      assert.strictEqual(res, 9.248833333333337)
    })
    it('toString', function () {
      const res = ra.toString(0)
      assert.strictEqual(res, '9ʰ14ᵐ56ˢ')
    })
    it('toDMS', function () {
      assert.deepStrictEqual(ra.toDMS(), [false, 9, 14, 55.8])
    })
  })

  describe('Time', function () {
    const t = new sexa.Time(false, 15, 22, 7)

    it('new Time', function () {
      assert.strictEqual(t.sec(), 55327)
    })
    it('rad', function () {
      const res = t.rad()
      assert.strictEqual(res, 4.023492980212095)
    })
    it('toString', function () {
      const res = t.toString()
      assert.strictEqual(res, '15ʰ22ᵐ7ˢ')
    })
    it('toHMS', function () {
      const res = t.toHMS()
      assert.deepStrictEqual(res, [false, 15, 22, 7])
    })
    it('min', function () {
      const res = t.min()
      assert.strictEqual(res, 922.1166666666667)
    })
    it('hour', function () {
      const res = t.hour()
      assert.strictEqual(res, 15.368611111111111)
    })
    it('day', function () {
      const res = t.day()
      assert.strictEqual(res, 0.6403587962962963)
    })
    it('toString negative', function () {
      const t = new sexa.Time(true, 0, 61, 61)
      assert.strictEqual(t.sec(), -3721)
      assert.strictEqual(t.toString(), '-1ʰ2ᵐ1ˢ')
    })
  })
})
