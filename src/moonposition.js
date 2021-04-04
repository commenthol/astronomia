/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module moonposition
 */
/**
 * Moonposition: Chapter 47, Position of the Moon.
 */

import base, { Coord } from './base.js' // eslint-disable-line no-unused-vars
const { asin, sin } = Math
const D2R = Math.PI / 180

const EARTH_RADIUS = 6378.137 // km

/**
 * parallax returns equatorial horizontal parallax of the Moon.
 *
 * @param {Number} distance - distance between centers of the Earth and Moon, in km.
 * @returns {Number} Result in radians.
 */
export function parallax (distance) {
  // p. 337
  return asin(EARTH_RADIUS / distance)
}

function dmf (T) {
  const d = base.horner(T, 297.8501921 * D2R, 445267.1114034 * D2R, -0.0018819 * D2R, D2R / 545868, -D2R / 113065000)
  const m = base.horner(T, 357.5291092 * D2R, 35999.0502909 * D2R, -0.0001536 * D2R, D2R / 24490000)
  const m_ = base.horner(T, 134.9633964 * D2R, 477198.8675055 * D2R,
    0.0087414 * D2R, D2R / 69699, -D2R / 14712000)
  const f = base.horner(T, 93.272095 * D2R, 483202.0175233 * D2R, -0.0036539 * D2R, -D2R / 3526000, D2R / 863310000)
  return [d, m, m_, f]
}

/**
 * position returns geocentric location of the Moon.
 *
 * Results are referenced to mean equinox of date and do not include
 * the effect of nutation.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns {Coord}
 *  {number} lon - Geocentric longitude λ, in radians.
 *  {number} lat - Geocentric latitude β, in radians.
 *  {number} range - Distance Δ between centers of the Earth and Moon, in km.
 */
export function position (jde) {
  const T = base.J2000Century(jde)
  const l_ = base.horner(T, 218.3164477 * D2R, 481267.88123421 * D2R, -0.0015786 * D2R, D2R / 538841, -D2R / 65194000)
  const [d, m, m_, f] = dmf(T)
  const a1 = 119.75 * D2R + 131.849 * D2R * T
  const a2 = 53.09 * D2R + 479264.29 * D2R * T
  const a3 = 313.45 * D2R + 481266.484 * D2R * T
  const e = base.horner(T, 1, -0.002516, -0.0000074)
  const e2 = e * e
  let Σl = 3958 * sin(a1) + 1962 * sin(l_ - f) + 318 * sin(a2)
  let Σr = 0.0
  let Σb = -2235 * sin(l_) + 382 * sin(a3) + 175 * sin(a1 - f) +
    175 * sin(a1 + f) + 127 * sin(l_ - m_) - 115 * sin(l_ + m_)
  ta.forEach((r) => {
    const [sina, cosa] = base.sincos(d * r.d + m * r.m + m_ * r.m_ + f * r.f)
    switch (r.m) {
      case 0:
        Σl += r.Σl * sina
        Σr += r.Σr * cosa
        break
      case -1:
      case 1:
        Σl += r.Σl * sina * e
        Σr += r.Σr * cosa * e
        break
      case -2:
      case 2:
        Σl += r.Σl * sina * e2
        Σr += r.Σr * cosa * e2
        break
    }
  })

  tb.forEach((r) => {
    const sb = sin(d * r.d + m * r.m + m_ * r.m_ + f * r.f)
    switch (r.m) {
      case 0:
        Σb += r.Σb * sb
        break
      case -1:
      case 1:
        Σb += r.Σb * sb * e
        break
      case -2:
      case 2:
        Σb += r.Σb * sb * e2
        break
    }
  })
  const lon = base.pmod(l_, 2 * Math.PI) + Σl * 1e-6 * D2R
  const lat = Σb * 1e-6 * D2R
  const range = 385000.56 + Σr * 1e-3
  return new base.Coord(lon, lat, range)
}

const ta = (function () {
  const ta = [
    [0, 0, 1, 0, 6288774, -20905355],
    [2, 0, -1, 0, 1274027, -3699111],
    [2, 0, 0, 0, 658314, -2955968],
    [0, 0, 2, 0, 213618, -569925],

    [0, 1, 0, 0, -185116, 48888],
    [0, 0, 0, 2, -114332, -3149],
    [2, 0, -2, 0, 58793, 246158],
    [2, -1, -1, 0, 57066, -152138],

    [2, 0, 1, 0, 53322, -170733],
    [2, -1, 0, 0, 45758, -204586],
    [0, 1, -1, 0, -40923, -129620],
    [1, 0, 0, 0, -34720, 108743],

    [0, 1, 1, 0, -30383, 104755],
    [2, 0, 0, -2, 15327, 10321],
    [0, 0, 1, 2, -12528, 0],
    [0, 0, 1, -2, 10980, 79661],

    [4, 0, -1, 0, 10675, -34782],
    [0, 0, 3, 0, 10034, -23210],
    [4, 0, -2, 0, 8548, -21636],
    [2, 1, -1, 0, -7888, 24208],

    [2, 1, 0, 0, -6766, 30824],
    [1, 0, -1, 0, -5163, -8379],
    [1, 1, 0, 0, 4987, -16675],
    [2, -1, 1, 0, 4036, -12831],

    [2, 0, 2, 0, 3994, -10445],
    [4, 0, 0, 0, 3861, -11650],
    [2, 0, -3, 0, 3665, 14403],
    [0, 1, -2, 0, -2689, -7003],

    [2, 0, -1, 2, -2602, 0],
    [2, -1, -2, 0, 2390, 10056],
    [1, 0, 1, 0, -2348, 6322],
    [2, -2, 0, 0, 2236, -9884],

    [0, 1, 2, 0, -2120, 5751],
    [0, 2, 0, 0, -2069, 0],
    [2, -2, -1, 0, 2048, -4950],
    [2, 0, 1, -2, -1773, 4130],

    [2, 0, 0, 2, -1595, 0],
    [4, -1, -1, 0, 1215, -3958],
    [0, 0, 2, 2, -1110, 0],
    [3, 0, -1, 0, -892, 3258],

    [2, 1, 1, 0, -810, 2616],
    [4, -1, -2, 0, 759, -1897],
    [0, 2, -1, 0, -713, -2117],
    [2, 2, -1, 0, -700, 2354],

    [2, 1, -2, 0, 691, 0],
    [2, -1, 0, -2, 596, 0],
    [4, 0, 1, 0, 549, -1423],
    [0, 0, 4, 0, 537, -1117],

    [4, -1, 0, 0, 520, -1571],
    [1, 0, -2, 0, -487, -1739],
    [2, 1, 0, -2, -399, 0],
    [0, 0, 2, -2, -381, -4421],

    [1, 1, 1, 0, 351, 0],
    [3, 0, -2, 0, -340, 0],
    [4, 0, -3, 0, 330, 0],
    [2, -1, 2, 0, 327, 0],

    [0, 2, 1, 0, -323, 1165],
    [1, 1, -1, 0, 299, 0],
    [2, 0, 3, 0, 294, 0],
    [2, 0, -1, -2, 0, 8752]
  ]
  return ta.map((row) => {
    const o = {}
    const vals = ['d', 'm', 'm_', 'f', 'Σl', 'Σr']
    vals.forEach((D2R, i) => {
      o[D2R] = row[i]
    })
    return o
  })
})()

const tb = (function () {
  const tb = [
    [0, 0, 0, 1, 5128122],
    [0, 0, 1, 1, 280602],
    [0, 0, 1, -1, 277693],
    [2, 0, 0, -1, 173237],

    [2, 0, -1, 1, 55413],
    [2, 0, -1, -1, 46271],
    [2, 0, 0, 1, 32573],
    [0, 0, 2, 1, 17198],

    [2, 0, 1, -1, 9266],
    [0, 0, 2, -1, 8822],
    [2, -1, 0, -1, 8216],
    [2, 0, -2, -1, 4324],

    [2, 0, 1, 1, 4200],
    [2, 1, 0, -1, -3359],
    [2, -1, -1, 1, 2463],
    [2, -1, 0, 1, 2211],

    [2, -1, -1, -1, 2065],
    [0, 1, -1, -1, -1870],
    [4, 0, -1, -1, 1828],
    [0, 1, 0, 1, -1794],

    [0, 0, 0, 3, -1749],
    [0, 1, -1, 1, -1565],
    [1, 0, 0, 1, -1491],
    [0, 1, 1, 1, -1475],

    [0, 1, 1, -1, -1410],
    [0, 1, 0, -1, -1344],
    [1, 0, 0, -1, -1335],
    [0, 0, 3, 1, 1107],

    [4, 0, 0, -1, 1021],
    [4, 0, -1, 1, 833],

    [0, 0, 1, -3, 777],
    [4, 0, -2, 1, 671],
    [2, 0, 0, -3, 607],
    [2, 0, 2, -1, 596],

    [2, -1, 1, -1, 491],
    [2, 0, -2, 1, -451],
    [0, 0, 3, -1, 439],
    [2, 0, 2, 1, 422],

    [2, 0, -3, -1, 421],
    [2, 1, -1, 1, -366],
    [2, 1, 0, 1, -351],
    [4, 0, 0, 1, 331],

    [2, -1, 1, 1, 315],
    [2, -2, 0, -1, 302],
    [0, 0, 1, 3, -283],
    [2, 1, 1, -1, -229],

    [1, 1, 0, -1, 223],
    [1, 1, 0, 1, 223],
    [0, 1, -2, -1, -220],
    [2, 1, -1, -1, -220],

    [1, 0, 1, 1, -185],
    [2, -1, -2, -1, 181],
    [0, 1, 2, 1, -177],
    [4, 0, -2, -1, 176],

    [4, -1, -1, -1, 166],
    [1, 0, 1, -1, -164],
    [4, 0, 1, -1, 132],
    [1, 0, -1, -1, -119],

    [4, -1, 0, -1, 115],
    [2, -2, 0, 1, 107]
  ]
  return tb.map((row) => {
    const o = {}
    const vals = ['d', 'm', 'm_', 'f', 'Σb']
    vals.forEach((D2R, i) => {
      o[D2R] = row[i]
    })
    return o
  })
})()

/**
 * Node returns longitude of the mean ascending node of the lunar orbit.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns result in radians.
 */
export function node (jde) {
  return base.pmod(
    base.horner(
      base.J2000Century(jde),
      125.0445479 * D2R,
      -1934.1362891 * D2R,
      0.0020754 * D2R,
      D2R / 467441,
      -D2R / 60616000
    ), 2 * Math.PI
  )
}

/**
 * perigee returns longitude of perigee of the lunar orbit.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns result in radians.
 */
export function perigee (jde) {
  return base.pmod(
    base.horner(
      base.J2000Century(jde),
      83.3532465 * D2R,
      4069.0137287 * D2R,
      -0.01032 * D2R,
      -D2R / 80053,
      D2R / 18999000
    ), 2 * Math.PI
  )
}

/**
 * trueNode returns longitude of the true ascending node.
 *
 * That is, the node of the instantaneous lunar orbit.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns result in radians.
 */
export function trueNode (jde) {
  const [d, m, m_, f] = dmf(base.J2000Century(jde))
  return node(jde) +
    -1.4979 * D2R * sin(2 * (d - f)) +
    -0.15 * D2R * sin(m) +
    -0.1226 * D2R * sin(2 * d) +
    0.1176 * D2R * sin(2 * f) +
    -0.0801 * D2R * sin(2 * (m_ - f))
}

export default {
  parallax,
  position,
  node,
  perigee,
  trueNode
}
