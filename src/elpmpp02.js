/**
 * @copyright 2020 mdmunir
 * @copyright 2020 commenthol
 * @license MIT
 * @module elpmpp02
 */

/**
 * Elp Mpp 02.
 *
 * 
 */

import base from './base'
import coord from './coord'
import precess from './precess'

const { horner } = base

function sumMain(args, series, phase) {
  // 0  1   2  3  4
  // D, F, l, l_, A
  let sum = 0.0
  series.forEach(row => {
    let φ = phase
    for (var i = 0; i < 4; i++) {
      φ += row[i] * args[i]
    }
    sum += row[4] * Math.sin(φ)
  })
  return sum
}

function sumPert(T, args, series) {
  // 0  1   2  3  4   5   6   7   8      9   10  11  12  13  14 15
  // A, φ,  D, F, l, l_,  Me, Ve, Earth, Ma, Ju, Sa, Ur, Ne, ζ
  const coeffs = []
  series.forEach((rows, index) => {
    coeffs[index] = 0.0
    rows.forEach(row => {
      let [A, φ] = row
      for (var i = 0; i <= 12; i++) {
        φ += row[i + 2] * args[i]
      }
      coeffs[index] += A * Math.sin(φ)
    })
  })
  return horner(T, coeffs)
}

function dms(d, m, s) {
  return (d * 3600 + m * 60 + s) * SEC2RAD
}

const SEC2RAD = 1 / 3600 * Math.PI / 180
const DIST_FACTOR = 384747.961370173 / 384747.980674318

// Fit to DE405
const CW1 = [3.8103440908308803, 8399.6847300719292, -3.3189520425500942E-005, 3.1102494491060616E-008, -2.0328237648922845E-010]
const CW2 = [1.4547895404440776, 70.993305448479248, -1.8548192818782712E-004, -2.1961637966359412E-007, 1.0327016221314225E-009]
const CW3 = [2.1824388474237688, -33.781427419672326, 3.0816644950982666E-005, 3.6447710769397583E-008, -1.7385418604587960E-010]

// Fit to DE406
CW1[3] += -0.00018865 * SEC2RAD
CW1[4] += -0.00001024 * SEC2RAD
CW2[2] += +0.00470602 * SEC2RAD
CW2[3] += -0.00025213 * SEC2RAD
CW3[2] += -0.00261070 * SEC2RAD
CW3[3] += -0.00010712 * SEC2RAD

const CEarth = [1.7534699452640696, 628.30758508103156, -9.7932363584126268E-008, 4.3633231299858238E-011, 7.2722052166430391E-013]
const CPeri = [1.7965956331206001, 5.6298669711442699E-003, 2.5659491293243853E-006, -5.7275888286280579E-010, 5.5166948773454099E-011]

const CMe = [dms(252, 15, 3.216919), 538101628.66888 * SEC2RAD]
const CVe = [dms(181, 58, 44.758419), 210664136.45777 * SEC2RAD]
const CMa = [dms(355, 25, 3.642778), 68905077.65936 * SEC2RAD]
const CJu = [dms(34, 21, 5.379392), 10925660.57335 * SEC2RAD]
const CSa = [dms(50, 4, 38.902495), 4399609.33632 * SEC2RAD]
const CUr = [dms(314, 3, 4.354234), 1542482.57845 * SEC2RAD]
const CNe = [dms(304, 20, 56.808371), 786547.897 * SEC2RAD]


export class ElpMpp {
  /**
   * VSOP87 representation of a Planet
   * @constructs ElpMpp
   * @param {object} data - elp data series
   * @example
   * ```js
   * // for use in browser
   * import {data} from 'astronomia'
   * const elp = new elpmpp02.ElpMpp(data.elpMpp02Data)
   * ```
   */
  constructor(data) {
    if (typeof data !== 'object') throw new TypeError('need Elp data')
    this.series = data
  }

  /**
   * Position returns rectangular coordinates referenced to the mean equinox of date.
   * @param {Number} jde - Julian ephemeris day
   * @return {object} rectangular coordinates
   *   {Number} x
   *   {Number} y
   *   {Number} z
   */
  positionXYZ(jde) {
    const T = base.J2000Century(jde)

    const W1 = horner(T, CW1)
    const W2 = horner(T, CW2)
    const W3 = horner(T, CW3)
    const Earth = horner(T, CEarth)
    const Peri = horner(T, CPeri)

    // planet
    const Me = horner(T, CMe)
    const Ve = horner(T, CVe)
    const Ma = horner(T, CMa)
    const Ju = horner(T, CJu)
    const Sa = horner(T, CSa)
    const Ur = horner(T, CUr)
    const Ne = horner(T, CNe)

    let D = W1 - Earth + Math.PI
    let F = W1 - W3
    let l = W1 - W2
    let l_ = Earth - Peri
    let ζ = W1 + (5029.0966 - 0.29965) * SEC2RAD * T

    const mainArgs = [D, F, l, l_],
      pertArgs = [D, F, l, l_, Me, Ve, Earth, Ma, Ju, Sa, Ur, Ne, ζ]

    let lon = W1 + (sumMain(mainArgs, this.series.main.L, 0.0) + sumPert(T, pertArgs, this.series.pert.L)) * SEC2RAD
    let lat = (sumMain(mainArgs, this.series.main.B, 0.0) + sumPert(T, pertArgs, this.series.pert.B)) * SEC2RAD
    let R = (sumMain(mainArgs, this.series.main.R, Math.PI / 2) + sumPert(T, pertArgs, this.series.pert.R)) * DIST_FACTOR

    let x = R * Math.cos(lon) * Math.cos(lat)
    let y = R * Math.sin(lon) * Math.cos(lat)
    let z = R * Math.sin(lat)

    // Precession matrix
    let P = horner(T, 0, 0.10180391e-4, 0.47020439e-6, -0.5417367e-9, -0.2507948e-11, 0.463486e-14)
    let Q = horner(T, 0, -0.113469002e-3, 0.12372674e-6, 0.12654170e-8, -0.1371808e-11, -0.320334e-14)
    var sq = Math.sqrt(1 - P * P - Q * Q)
    let p11 = 1 - 2 * P * P,
      p12 = 2 * P * Q,
      p13 = 2 * P * sq
    let p21 = 2 * P * Q,
      p22 = 1 - 2 * Q * Q,
      p23 = -2 * Q * sq
    let p31 = -2 * P * sq,
      p32 = 2 * Q * sq,
      p33 = 1 - 2 * P * P - 2 * Q * Q

    return {
      x: p11 * x + p12 * y + p13 * z,
      y: p21 * x + p22 * y + p23 * z,
      z: p31 * x + p32 * y + p33 * z,
    }
  }

  /**
   * Position2000 returns ecliptic position of planets by Elp Mpp theory.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {base.Coord} Results are for the dynamical equinox and ecliptic J2000.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */
  position2000(jde) {
    let { x, y, z } = this.positionXYZ(jde)
    let range = Math.hypot(x, y, z)
    let lat = Math.asin(z / range)
    let lon = Math.atan2(y, x)

    return new base.Coord(lon, lat, range)
  }

  /**
   * Position returns ecliptic position of moon at equinox and ecliptic of date.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {base.Coord} Results are positions consistent with those from Meeus's
   * Apendix III, that is, at equinox and ecliptic of date.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */
  position(jde) {
    const { lat, lon, range } = this.position2000(jde)
    const eclFrom = new coord.Ecliptic(lon, lat)
    const epochFrom = 2000.0
    const epochTo = base.JDEToJulianYear(jde)
    const eclTo = precess.eclipticPosition(eclFrom, epochFrom, epochTo, 0, 0)
    return new base.Coord(
      eclTo.lon,
      eclTo.lat,
      range
    )
  }
}


/**
 * trueVSOP87 returns the true geometric position of the sun as ecliptic coordinates.
 *
 * Result computed by full VSOP87 theory.  Result is at equator and equinox
 * of date in the FK5 frame.  It does not include nutation or aberration.
 *
 * @param {Object} elpData
 * @param {Number} jde - Julian ephemeris day
 * @returns {Object}
 *   {Number} lon - ecliptic longitude in radians
 *   {Number} lat - ecliptic latitude in radians
 *   {Number} range - range in AU
 */
export function position(elpData, jde) {
  let elpMpp = new ElpMpp(elpData)
  return elpMpp.position(jde)
}

export default {
  ElpMpp,
  position
}
