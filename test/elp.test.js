import assert from 'assert'
import float from './support/float.js'
import { elp, data, nutation, base } from '../src/index.js'

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

  it('position horizon', function () {
    const JplHorizonData = [
      //       date                JD                range         deltaT        lon         lat
      ['1000-Jan-01 00:00', 2086307.500000000, 3.9301856664E+05, 1543.097000, 191.1932228, 1.3375209],
      ['1150-Jan-01 00:00', 2141095.500000000, 3.9712002417E+05, 1028.017543, 288.6447145, -4.8371075],
      ['1300-Jan-01 00:00', 2195882.500000000, 3.7028763340E+05, 663.466000, 25.0953460, 3.4922498],
      ['1450-Jan-01 00:00', 2250670.500000000, 3.8884144859E+05, 284.056793, 141.4192114, -0.0675729],
      ['1600-Jan-01 00:00', 2305447.500000000, 3.8312040711E+05, 113.140000, 104.7884667, 1.4156390],
      ['1750-Jan-01 00:00', 2360234.500000000, 4.0292344291E+05, 17.088263, 192.1970825, -5.2852296],
      ['1900-Jan-01 00:00', 2415020.500000000, 3.6838482401E+05, -1.977000, 272.4162611, 1.1082667],
      ['2050-Jan-01 00:00', 2469807.500000000, 3.7870904422E+05, 69.183922, 18.6755980, 3.3912135],
      ['2200-Jan-01 00:00', 2524593.500000000, 4.0434293645E+05, 69.183800, 96.5064560, -4.2935823],
      ['2350-Jan-01 00:00', 2579379.500000000, 3.9541954019E+05, 69.183753, 169.6857639, -2.2195292],
      ['2500-Jan-01 00:00', 2634166.500000000, 3.5703497671E+05, 69.183691, 271.3583749, 4.9779488],
      ['2650-Jan-01 00:00', 2688952.500000000, 3.9036654046E+05, 69.183588, 0.7988211, -2.4612485],
      ['2800-Jan-01 00:00', 2743738.500000000, 4.0343739337E+05, 69.183555, 74.2741320, -4.3494133],
      ['2950-Jan-01 00:00', 2798525.500000000, 3.7651911566E+05, 69.183485, 166.3008243, 4.3577757]
    ]
    // truncate version
    const moon = new elp.Moon(data.elpMppDe)
    JplHorizonData.forEach(function (row) {
      const [, jd, R, deltaT, L, B] = row
      const jde = jd + deltaT / (24 * 3600)
      const [Δψ] = nutation.nutation(jde)
      let { lon, lat, range } = moon.position(jde)
      lon = base.pmod(lon + Δψ, 2 * Math.PI)

      assert.ok(Math.abs(lon * R2D - L) * 3600 < 1.0, `L got ${lon * R2D} expected ${L}`) // less than 1"
      assert.ok(Math.abs(lat * R2D - B) * 3600 < 0.5, `B got ${lat * R2D} expected ${B}`) // less than 0.5"
      // unsure about range
      assert.ok(Math.abs(range - R) < 41, `R got ${range} expected ${R}`)
    })
  })
})
