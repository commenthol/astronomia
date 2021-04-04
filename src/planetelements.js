/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module planetelements
 */
/**
 * Planetelements: Chapter 31, Elements of Planetary Orbits.
 *
 * Partial:  Only implemented for mean equinox of date.
 */

import base from './base.js'

// planet names used in cMean
export const mercury = 'mercury'
export const venus = 'venus'
export const earth = 'earth'
export const mars = 'mars'
export const jupiter = 'jupiter'
export const saturn = 'saturn'
export const uranus = 'uranus'
export const neptune = 'neptune'

/**
 * Elements contains orbital elements as returned by functions in this package.
 *
 * Some other elements easily derived from these are
 *
 *  Mean Anomolay, M = Lon - Peri
 *  Argument of Perihelion, ω = Peri - Node
 *
 * @param {Number|Object} [lon]  - mean longitude, L
 * @param {Number} [axis] - semimajor axis, a
 * @param {Number} [ecc]  - eccentricity, e
 * @param {Number} [inc]  - inclination, i
 * @param {Number} [node] - longitude of ascending node, Ω
 * @param {Number} [peri] - longitude of perihelion, ϖ (Meeus likes π better)
 */
export function Elements (lon, axis, ecc, inc, node, peri) {
  const o = (typeof lon === 'object' ? lon : {})
  this.lon = o.lon || lon
  this.axis = o.axis || axis
  this.ecc = o.ecc || ecc
  this.inc = o.inc || inc
  this.node = o.node || node
  this.peri = o.peri || peri
}

/**
 * Table 31.A, p. 212
 */
const cMean = {
  mercury: { // Mercury
    L: [252.250906, 149474.0722491, 0.0003035, 0.000000018],
    a: [0.38709831],
    e: [0.20563175, 0.000020407, -0.0000000283, -0.00000000018],
    i: [7.004986, 0.0018215, -0.0000181, 0.000000056],
    Ω: [48.330893, 1.1861883, 0.00017542, 0.000000215],
    ϖ: [77.456119, 1.5564776, 0.00029544, 0.000000009]
  },
  venus: { // Venus
    L: [181.979801, 58519.2130302, 0.00031014, 0.000000015],
    a: [0.72332982],
    e: [0.00677192, -0.000047765, 0.0000000981, 0.00000000046],
    i: [3.394662, 0.0010037, -0.00000088, -0.000000007],
    Ω: [76.67992, 0.9011206, 0.00040618, -0.000000093],
    ϖ: [131.563703, 1.4022288, -0.00107618, -0.000005678]
  },
  earth: { // Earth
    L: [100.466457, 36000.7698278, 0.00030322, 0.00000002],
    a: [1.000001018],
    e: [0.01670863, -0.000042037, -0.0000001267, 0.00000000014],
    i: [0],
    Ω: undefined,
    ϖ: [102.937348, 1.7195366, 0.00045688, -0.000000018]
  },
  mars: { // Mars
    L: [355.433, 19141.6964471, 0.00031052, 0.000000016],
    a: [1.523679342],
    e: [0.09340065, 0.000090484, -0.0000000806, -0.00000000025],
    i: [1.849726, -0.0006011, 0.00001276, -0.000000007],
    Ω: [49.558093, 0.7720959, 0.00001557, 0.000002267],
    ϖ: [336.060234, 1.8410449, 0.00013477, 0.000000536]
  },
  jupiter: { // Jupiter
    L: [34.351519, 3036.3027748, 0.0002233, 0.000000037],
    a: [5.202603209, 0.0000001913],
    e: [0.04849793, 0.000163225, -0.0000004714, -0.00000000201],
    i: [1.303267, -0.0054965, 0.00000466, -0.000000002],
    Ω: [100.464407, 1.0209774, 0.00040315, 0.000000404],
    ϖ: [14.331207, 1.6126352, 0.00103042, -0.000004464]
  },
  saturn: { // Saturn
    L: [50.077444, 1223.5110686, 0.00051908, -0.00000003],
    a: [9.554909192, -0.0000021390, 0.000000004],
    e: [0.05554814, -0.000346641, -0.0000006436, 0.0000000034],
    i: [2.488879, -0.0037362, -0.00001519, 0.000000087],
    Ω: [113.665503, 0.877088, -0.00012176, -0.000002249],
    ϖ: [93.057237, 1.9637613, 0.00083753, 0.000004928]
  },
  uranus: { // Uranus
    L: [314.055005, 429.8640561, 0.0003039, 0.000000026],
    a: [19.218446062, -0.0000000372, 0.00000000098],
    e: [0.04638122, -0.000027293, 0.0000000789, 0.00000000024],
    i: [0.773197, 0.0007744, 0.00003749, -0.000000092],
    Ω: [74.005957, 0.5211278, 0.00133947, 0.000018484],
    ϖ: [173.005291, 1.486379, 0.00021406, 0.000000434]
  },
  neptune: { // Neptune
    L: [304.348665, 219.8833092, 0.00030882, 0.000000018],
    a: [30.110386869, -0.0000001663, 0.00000000069],
    e: [0.00945575, 0.000006033, 0, -0.00000000005],
    i: [1.769953, -0.0093082, -0.00000708, 0.000000027],
    Ω: [131.784057, 1.1022039, 0.00025952, -0.000000637],
    ϖ: [48.120276, 1.4262957, 0.00038434, 0.00000002]
  }
}

/**
 * Mean returns mean orbital elements for a planet
 *
 * Argument p must be a planet const as defined above, argument e is
 * a result parameter.  A valid non-undefined pointer to an Elements struct
 * must be passed in.
 *
 * Results are referenced to mean dynamical ecliptic and equinox of date.
 *
 * Semimajor axis is in AU, angular elements are in radians.
 */
export function mean (p, jde, e) {
  const T = base.J2000Century(jde)
  const c = cMean[p]
  e = e || new Elements()
  e.lon = base.pmod(base.horner(T, c.L) * Math.PI / 180, 2 * Math.PI)
  e.axis = base.horner(T, c.a)
  e.ecc = base.horner(T, c.e)
  e.inc = base.horner(T, c.i) * Math.PI / 180
  e.node = base.horner(T, c.Ω) * Math.PI / 180
  e.peri = base.horner(T, c.ϖ) * Math.PI / 180
  return e
}

/**
 * Inc returns mean inclination for a planet at a date.
 *
 * Result is the same as the Inc field returned by function Mean.  That is,
 * radians, referenced to mean dynamical ecliptic and equinox of date.
 */
export function inc (p, jde) { // (p int, jde float64)  float64
  return base.horner(base.J2000Century(jde), cMean[p].i) * Math.PI / 180
}

/**
 * Node returns mean longitude of ascending node for a planet at a date.
 *
 * Result is the same as the Node field returned by function Mean.  That is,
 * radians, referenced to mean dynamical ecliptic and equinox of date.
 */
export function node (p, jde) { // (p int, jde float64)  float64
  return base.horner(base.J2000Century(jde), cMean[p].Ω) * Math.PI / 180
}

export default {
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  Elements,
  mean,
  inc,
  node
}
