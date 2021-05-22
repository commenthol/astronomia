import assert from 'assert'
import { planetposition, julian, sexagesimal as sexa } from '../src/index.js'
import data from '../data/index.js'

describe('#planetposition', function () {
  describe('position2000', function () {
    it('Mars at 2415020.0', function () {
      // Mars 1899 spherical data from vsop87.chk.
      const jd = 2415020.0
      const planet = new planetposition.Planet(data.mars)
      const res = planet.position2000(jd)

      assert.strictEqual(res.lon, 5.018579265623366)
      assert.strictEqual(res.lat, -0.02740734998738619)
      assert.strictEqual(res.range, 1.421877771845356)
    })

    it('Mars at 2415020.0 VSOP D', function () {
      // Mars 1899 spherical data from vsop87.chk.
      const jd = 2415020.0
      const planet = new planetposition.Planet(data.vsop87Dmars)
      const res = planet.position2000(jd)

      assert.strictEqual(res.lon, 5.01857925809491)
      assert.strictEqual(res.lat, -0.02740737901167283)
      assert.strictEqual(res.range, 1.4218777705060395)
    })

    it('Venus at 1992-12-20', function () {
      // Example 32.a, p. 219
      const jd = julian.CalendarGregorianToJD(1992, 12, 20)
      const planet = new planetposition.Planet(data.venus)
      const res = planet.position2000(jd)

      assert.strictEqual(res.lon, 0.45749253478276586) // rad
      assert.strictEqual(res.lat, -0.045729822980889484) // rad
      assert.strictEqual(res.range, 0.7246016739689574) // AU
    })
  })

  describe('position', function () {
    it('Venus at 1992-12-20', function () {
      // Example 32.a, p. 219
      const jd = julian.CalendarGregorianToJD(1992, 12, 20)
      const planet = new planetposition.Planet(data.venus)
      const res = planet.position(jd)
      assert.strictEqual(new sexa.Angle(res.lon).toDegString(5), '26°.11412')
      assert.strictEqual(new sexa.Angle(res.lat).toDegString(5), '-2°.6206')
      assert.strictEqual(res.range, 0.7246016739689574)
    })

    it('Venus at 1992-12-20 VSOPD', function () {
      // Example 32.a, p. 219
      const jd = julian.CalendarGregorianToJD(1992, 12, 20)
      const planet = new planetposition.Planet(data.vsop87Dvenus)
      const res = planet.position(jd)
      assert.strictEqual(new sexa.Angle(res.lon).toDegString(5), '26°.11412')
      assert.strictEqual(new sexa.Angle(res.lat).toDegString(5), '-2°.6206')
      assert.strictEqual(res.range, 0.7246016759555222)
    })
  })

  describe('toFK5', function () {
    it('Venus at 1992-12-20', function () {
      // Meeus provides no worked example for the FK5 conversion given by
      // formula 32.3, p. 219.  This at least displays the result when applied
      // to the position of Example 32.a on that page.
      const jd = julian.CalendarGregorianToJD(1992, 12, 20)
      const planet = new planetposition.Planet(data.venus)
      const pos = planet.position(jd)
      const fk5 = planetposition.toFK5(pos.lon, pos.lat, jd)
      assert.strictEqual(new sexa.Angle(fk5.lon).toDegString(5), '26°.11409')
      assert.strictEqual(new sexa.Angle(fk5.lat).toDegString(5), '-2°.6206')
    })
  })
})
