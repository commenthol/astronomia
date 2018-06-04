import assert from 'assert'
import {base, angle, julian, sexagesimal as sexa} from '..'

describe('#angle', function () {
  describe('single functions', function () {
    var c1 = new base.Coord(
      new sexa.RA(14, 15, 39.7).rad(),
      new sexa.Angle(false, 19, 10, 57).rad()
    )
    var c2 = new base.Coord(
      new sexa.RA(13, 25, 11.6).rad(),
      new sexa.Angle(true, 11, 9, 41).rad()
    )

    it('sep', function () {
      // Example 17.a, p. 110.0
      var d = angle.sep(c1, c2)
      assert.equal(new sexa.Angle(d).toString(0), '32°47′35″')
    })

    it('sepHav', function () {
      // Example 17.a, p. 110.0
      var d = angle.sepHav(c1, c2)
      assert.ok(new sexa.Angle(d).toString(0), '32°47′35″')
    })

    it('sepPauwels', function () {
      // Example 17.b, p. 116.0
      var d = angle.sepPauwels(c1, c2)
      assert.ok(new sexa.Angle(d).toString(0), '32°47′35″')
    })

    it('relativePosition', function () {
      var p = angle.relativePosition(c1, c2)
      assert.equal(new sexa.Angle(p).toString(0), '22°23′25″')
    })
  })

  describe('movement of two celestial bodies', function () {
    var jd1 = julian.CalendarGregorianToJD(1978, 9, 13)
    var coords1 = [
      new base.Coord(
        new sexa.RA(10, 29, 44.27).rad(),
        new sexa.Angle(false, 11, 2, 5.9).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 36, 19.63).rad(),
        new sexa.Angle(false, 10, 29, 51.7).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 43, 1.75).rad(),
        new sexa.Angle(false, 9, 55, 16.7).rad()
      )
    ]

    var jd3 = julian.CalendarGregorianToJD(1978, 9, 15)
    var coords2 = [
      new base.Coord(
        new sexa.RA(10, 33, 29.64).rad(),
        new sexa.Angle(false, 10, 40, 13.2).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 33, 57.97).rad(),
        new sexa.Angle(false, 10, 37, 33.4).rad()
      ),
      new base.Coord(
        new sexa.RA(10, 34, 26.22).rad(),
        new sexa.Angle(false, 10, 34, 53.9).rad()
      )
    ]

    /**
     * First exercise, p. 110.0
     */
    it('sep', function () {
      var c1 = new base.Coord(
        new sexa.RA(4, 35, 55.2).rad(),
        new sexa.Angle(false, 16, 30, 33).rad()
      )
      var c2 = new base.Coord(
        new sexa.RA(16, 29, 24).rad(),
        new sexa.Angle(true, 26, 25, 55).rad()
      )
      var d = angle.sep(c1, c2)
      var answer = new sexa.Angle(false, 169, 58, 0).rad()
      assert.ok(Math.abs(d - answer) < 1e-4, new sexa.Angle(d).toString())
    })

    /**
     * Second exercise, p. 110.0
     */
    it('minSep', function () {
      var err
      try {
        var sep = angle.minSep(jd1, jd3, coords1, coords2)
      } catch (e) {
        err = e
      }
      assert.ok(!err, '' + err)
      var exp = 0.5017 * Math.PI / 180 // on p. 111
      assert.ok(Math.abs((sep - exp) / sep) < 1e-3, new sexa.Angle(sep).toString())
    })

    it('minSepHav', function () {
      var err
      try {
        var sep = angle.minSepHav(jd1, jd3, coords1, coords2)
      } catch (e) {
        err = e
      }
      assert.ok(!err, '' + err)
      var exp = 0.5017 * Math.PI / 180 // on p. 111
      assert.ok(Math.abs((sep - exp) / sep) < 1e-3, new sexa.Angle(sep).toString())
    })

    it('minSepPauwels', function () {
      var err
      try {
        var sep = angle.minSepPauwels(jd1, jd3, coords1, coords2)
      } catch (e) {
        err = e
      }
      assert.ok(!err, '' + err)
      var exp = 0.5017 * Math.PI / 180 // on p. 111
      assert.ok(Math.abs((sep - exp) / sep) < 1e-3, new sexa.Angle(sep).toString())
    })

    /**
     * "rectangular coordinate" solution, p. 113.0
     */
    it('minSepRect', function () {
      try {
        var sep = angle.minSepRect(jd1, jd3, coords1, coords2)
      } catch (err) {
        assert.ok(!err, '' + err)
      }
      var exp = 224 * Math.PI / 180 / 3600 // on p. 111
      assert.ok(Math.abs((sep - exp) / sep) < 1e-2, new sexa.Angle(sep))
    })
  })
})
