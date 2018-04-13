import assert from 'assert'
import {sexagesimal as sexa} from '..'

describe('#sexagesimal', function () {
  describe('functions', function () {
    it('DMSToDeg', function () {
      // Example p. 7.
      var res = sexa.DMSToDeg(false, 23, 26, 49)
      assert.equal(res, 23.446944444444444)
    })
    it('DegToDMS', function () {
      // Example p. 7.
      var res = sexa.degToDMS(-23.446944444444444)
      assert.deepEqual(res, [true, 23, 26, 49])
    })
  })

  describe('Angle', function () {
    it('negative', function () {
      // Example negative values, p. 9.
      var res = new sexa.Angle(true, 13, 47, 22)
      assert.equal(res.deg(), -13.789444444444445)
      assert.equal(res.toString(), '-13°47′22″')
      assert.equal(res.toDegString(3), '-13°.789')
      assert.deepEqual(res.toDMS(), [true, 13, 47, 22])
    })

    it('positive', function () {
      var res = new sexa.Angle(false, 0, 32, 41)
      assert.equal(res.deg(), 0.5447222222222222)
      assert.equal(res.toString(), '0°32′41″')
      assert.equal(res.toDegString(5), '0°.54472')
      assert.deepEqual(res.toDMS(), [false, 0, 32, 41])
    })

    it('positive #2', function () {
      var res = new sexa.Angle(false, 0, 0, 47.34)
      assert.equal(res.deg(), 0.01315)
      assert.equal(res.toString(), '0°0′47.34″')
    })

    it('new Angle with one argument', function () {
      var res = new sexa.Angle(0.5 * Math.PI)
      assert.equal(res.deg(), 90)
      assert.equal(res.toString(), '90°0′0″')
    })
  })

  describe('HourAngle', function () {
    var ha = new sexa.HourAngle(true, 12, 34, 45.6) // true means negative

    it('hour', function () {
      assert.equal(ha.hour(), -12.579333333333334)
    })
    it('rad', function () {
      assert.equal(ha.rad(), -3.2932617655881007)
    })
    it('deg', function () {
      assert.equal(ha.deg(), -12.579333333333334)
    })
    it('toString', function () {
      assert.equal(ha.toString(), '-12ʰ34ᵐ45.6ˢ')
    })
    it('toDegString', function () {
      assert.equal(ha.toDegString(4), '-12°.5793')
    })
    it('toDMS', function () {
      assert.deepEqual(ha.toDMS(), [true, 12, 34, 45.6])
    })
  })

  describe('RA', function () {
    var ra = new sexa.RA(9, 14, 55.8)

    it('Rad', function () {
      // Example 1.a, p. 8.
      var res = Math.tan(ra.rad())
      assert.equal(res, -0.8775169448762477)
    })
    it('Deg', function () {
      var res = ra.deg()
      assert.equal(res, 9.248833333333337)
    })
    it('toString', function () {
      var res = ra.toString(0)
      assert.equal(res, '9ʰ14ᵐ56ˢ')
    })
    it('toDMS', function () {
      assert.deepEqual(ra.toDMS(), [false, 9, 14, 55.8])
    })
  })

  describe('Time', function () {
    var t = new sexa.Time(false, 15, 22, 7)

    it('new Time', function () {
      assert.equal(t.sec(), 55327)
    })
    it('rad', function () {
      var res = t.rad()
      assert.equal(res, 4.023492980212095)
    })
    it('toString', function () {
      var res = t.toString()
      assert.equal(res, '15ʰ22ᵐ7ˢ')
    })
    it('toHMS', function () {
      var res = t.toHMS()
      assert.deepEqual(res, [false, 15, 22, 7])
    })
    it('min', function () {
      var res = t.min()
      assert.equal(res, 922.1166666666667)
    })
    it('hour', function () {
      var res = t.hour()
      assert.equal(res, 15.368611111111111)
    })
    it('day', function () {
      var res = t.day()
      assert.equal(res, 0.6403587962962963)
    })
    it('toString negative', function () {
      var t = new sexa.Time(true, 0, 61, 61)
      assert.equal(t.sec(), -3721)
      assert.equal(t.toString(), '-1ʰ2ᵐ1ˢ')
    })
  })
})
