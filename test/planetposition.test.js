import assert from 'assert'
import {planetposition, data, julian, sexagesimal as sexa} from '..'

describe('#planetposition', function () {
  describe('position2000', function () {
    it('Mars at 2415020.0', function () {
      // Mars 1899 spherical data from vsop87.chk.
      var jd = 2415020.0
      var planet = new planetposition.Planet(data.mars)
      var res = planet.position2000(jd)

      assert.equal(res.lon, 5.018579265623366)
      assert.equal(res.lat, -0.02740734998738619)
      assert.equal(res.range, 1.421877771845356)
    })

    it('Venus at 1992-12-20', function () {
      // Example 32.a, p. 219
      var jd = julian.CalendarGregorianToJD(1992, 12, 20)
      var planet = new planetposition.Planet(data.venus)
      var res = planet.position2000(jd)

      assert.equal(res.lon, 0.45749253478276586) // rad
      assert.equal(res.lat, -0.045729822980889484) // rad
      assert.equal(res.range, 0.7246016739689574) // AU
    })
  })

  describe('position', function () {
    it('Venus at 1992-12-20', function () {
      // Example 32.a, p. 219
      var jd = julian.CalendarGregorianToJD(1992, 12, 20)
      var planet = new planetposition.Planet(data.venus)
      var res = planet.position(jd)
      assert.equal(new sexa.Angle(res.lon).toDegString(5), '26°.11412')
      assert.equal(new sexa.Angle(res.lat).toDegString(5), '-2°.6206')
      assert.equal(res.range, 0.7246016739689574)
    })
  })

  describe('toFK5', function () {
    it('Venus at 1992-12-20', function () {
      // Meeus provides no worked example for the FK5 conversion given by
      // formula 32.3, p. 219.  This at least displays the result when applied
      // to the position of Example 32.a on that page.
      var jd = julian.CalendarGregorianToJD(1992, 12, 20)
      var planet = new planetposition.Planet(data.venus)
      var pos = planet.position(jd)
      var fk5 = planetposition.toFK5(pos.lon, pos.lat, jd)
      assert.equal(new sexa.Angle(fk5.lon).toDegString(5), '26°.11409')
      assert.equal(new sexa.Angle(fk5.lat).toDegString(5), '-2°.6206')
    })
  })
})
