/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module planetary
 */
/**
 * Planetary: Chapter 36, The Calculation of some Planetary Phenomena.
 *
 * Incomplete: Some functions unimplemented for lack of test data.
 */

import base from './base'

/**
 * Mean computes some intermediate values for a mean planetary configuration
 * given a year and a row of coefficients from Table 36.A, p. 250.0
 */
export function mean (y, a) { // (y float64, a *ca)  (J, M, T float64)
  // (36.1) p. 250
  const k = Math.floor((365.2425 * y + 1721060 - a.A) / a.B + 0.5)
  const J = a.A + k * a.B
  const M = base.pmod(a.M0 + k * a.M1, 360) * Math.PI / 180
  const T = base.J2000Century(J)
  return [J, M, T]
}

/**
 * Sum computes a sum of periodic terms.
 */
export function sum (T, M, c) { // (T, M float64, c [][]float64)  float64
  let j = base.horner(T, c[0])
  let mm = 0.0
  for (let i = 1; i < c.length; i++) {
    mm += M
    const [smm, cmm] = base.sincos(mm)
    j += smm * base.horner(T, c[i])
    i++
    j += cmm * base.horner(T, c[i])
  }
  return j
}

/**
 * ms returns a mean time corrected by a sum.
 */
export function ms (y, a, c) { // (y float64, a *ca, c [][]float64)  float64
  const [J, M, T] = mean(y, a)
  return J + sum(T, M, c)
}

/**
 * MercuryInfConj returns the time of an inferior conjunction of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function mercuryInfConj (y) { // (y float64)  (jde float64)
  return ms(y, micA, micB)
}

/**
 * MercurySupConj returns the time of a superior conjunction of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function mercurySupConj (y) { // (y float64)  (jde float64)
  return ms(y, mscA, mscB)
}

/**
 * VenusInfConj returns the time of an inferior conjunction of Venus.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function venusInfConj (y) { // (y float64)  (jde float64)
  return ms(y, vicA, vicB)
}

/**
 * MarsOpp returns the time of an opposition of Mars.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function marsOpp (y) { // (y float64)  (jde float64)
  return ms(y, moA, moB)
}

/**
 * SumA computes the sum of periodic terms with "additional angles"
 */
export function sumA (T, M, c, aa) { // (T, M float64, c [][]float64, aa []caa)  float64
  let i = c.length - 2 * aa.length
  let j = sum(T, M, c.slice(0, i))
  for (let k = 0; k < aa.length; k++) {
    const [saa, caa] = base.sincos((aa[k].c + aa[k].f * T) * Math.PI / 180)
    j += saa * base.horner(T, c[i])
    i++
    j += caa * base.horner(T, c[i])
    i++
  }
  return j
}

/**
 * Msa returns a mean time corrected by a sum.
 */
export function msa (y, a, c, aa) { // (y float64, a *ca, c [][]float64, aa []caa)  float64
  const [J, M, T] = mean(y, a)
  return J + sumA(T, M, c, aa)
}

/**
 * JupiterOpp returns the time of an opposition of Jupiter.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function jupiterOpp (y) { // (y float64)  (jde float64)
  return msa(y, joA, joB, jaa)
}

/**
 * SaturnOpp returns the time of an opposition of Saturn.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function saturnOpp (y) { // (y float64)  (jde float64)
  return msa(y, soA, soB, saa)
}

/**
 * SaturnConj returns the time of a conjunction of Saturn.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function saturnConj (y) { // (y float64)  (jde float64)
  return msa(y, scA, scB, saa)
}

/**
 * UranusOpp returns the time of an opposition of Uranus.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function uranusOpp (y) { // (y float64)  (jde float64)
  return msa(y, uoA, uoB, uaa)
}

/**
 * NeptuneOpp returns the time of an opposition of Neptune.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function neptuneOpp (y) { // (y float64)  (jde float64)
  return msa(y, noA, noB, naa)
}

/**
 * El computes time and elongation of a greatest elongation event.
 */
export function el (y, a, t, e) { // (y float64, a *ca, t, e [][]float64)  (jde, elongation float64)
  const [J, M, T] = mean(y, micA)
  return [J + sum(T, M, t), sum(T, M, e) * Math.PI / 180]
}

/**
 * MercuryEastElongation returns the time and elongation of a greatest eastern elongation of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function mercuryEastElongation (y) { // (y float64)  (jde, elongation float64)
  return el(y, micA, met, mee)
}

/**
 * MercuryWestElongation returns the time and elongation of a greatest western elongation of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
export function mercuryWestElongation (y) { // (y float64)  (jde, elongation float64)
  return el(y, micA, mwt, mwe)
}

export function marsStation2 (y) { // (y float64)  (jde float64)
  const [J, M, T] = mean(y, moA)
  return J + sum(T, M, ms2)
}

/**
 * ca holds coefficients from one line of table 36.A, p. 250
 */
function Ca (A, B, M0, M1) {
  this.A = A
  this.B = B
  this.M0 = M0
  this.M1 = M1
}

/**
 * Table 36.A, p. 250
 */
const micA = new Ca(2451612.023, 115.8774771, 63.5867, 114.2088742)
const mscA = new Ca(2451554.084, 115.8774771, 6.4822, 114.2088742)
const vicA = new Ca(2451996.706, 583.921361, 82.7311, 215.513058)
const moA = new Ca(2452097.382, 779.936104, 181.9573, 48.705244)
const joA = new Ca(2451870.628, 398.884046, 318.4681, 33.140229)
const soA = new Ca(2451870.17, 378.091904, 318.0172, 12.647487)
const scA = new Ca(2451681.124, 378.091904, 131.6934, 12.647487)
const uoA = new Ca(2451764.317, 369.656035, 213.6884, 4.333093)
const noA = new Ca(2451753.122, 367.486703, 202.6544, 2.194998)

/**
 * caa holds coefficients for "additional angles" for outer planets
 * as given on p. 251
 */
function Caa (c, f) {
  this.c = c
  this.f = f
}

const jaa = [
  new Caa(82.74, 40.76)
]

const saa = [
  new Caa(82.74, 40.76),
  new Caa(29.86, 1181.36),
  new Caa(14.13, 590.68),
  new Caa(220.02, 1262.87)
]

const uaa = [
  new Caa(207.83, 8.51),
  new Caa(108.84, 419.96)
]

const naa = [
  new Caa(207.83, 8.51),
  new Caa(276.74, 209.98)
]

/**
 * Table 33.B, p. 256
 */

/**
 * Mercury inferior conjunction
 */
const micB = [
  [0.0545, 0.0002],
  [-6.2008, 0.0074, 0.00003],
  [-3.275, -0.0197, 0.00001],
  [0.4737, -0.0052, -0.00001],
  [0.8111, 0.0033, -0.00002],
  [0.0037, 0.0018],
  [-0.1768, 0, 0.00001],
  [-0.0211, -0.0004],
  [0.0326, -0.0003],
  [0.0083, 0.0001],
  [-0.004, 0.0001]
]

/**
 * Mercury superior conjunction
 */
const mscB = [
  [-0.0548, -0.0002],
  [7.3894, -0.01, -0.00003],
  [3.22, 0.0197, -0.00001],
  [0.8383, -0.0064, -0.00001],
  [0.9666, 0.0039, -0.00003],
  [0.077, -0.0026],
  [0.2758, 0.0002, -0.00002],
  [-0.0128, -0.0008],
  [0.0734, -0.0004, -0.00001],
  [-0.0122, -0.0002],
  [0.0173, -0.0002]
]

/**
 * Venus inferior conjunction
 */
const vicB = [
  [-0.0096, 0.0002, -0.00001],
  [2.0009, -0.0033, -0.00001],
  [0.598, -0.0104, 0.00001],
  [0.0967, -0.0018, -0.00003],
  [0.0913, 0.0009, -0.00002],
  [0.0046, -0.0002],
  [0.0079, 0.0001]
]

/**
 * Mars opposition
 */
const moB = [
  [-0.3088, 0, 0.00002],
  [-17.6965, 0.0363, 0.00005],
  [18.3131, 0.0467, -0.00006],
  [-0.2162, -0.0198, -0.00001],
  [-4.5028, -0.0019, 0.00007],
  [0.8987, 0.0058, -0.00002],
  [0.7666, -0.005, -0.00003],
  [-0.3636, -0.0001, 0.00002],
  [0.0402, 0.0032],
  [0.0737, -0.0008],
  [-0.098, -0.0011]
]

/**
 * Jupiter opposition
 */
const joB = [
  [-0.1029, 0, -0.00009],
  [-1.9658, -0.0056, 0.00007],
  [6.1537, 0.021, -0.00006],
  [-0.2081, -0.0013],
  [-0.1116, -0.001],
  [0.0074, 0.0001],
  [-0.0097, -0.0001],
  [0, 0.0144, -0.00008],
  [0.3642, -0.0019, -0.00029]
]

/**
 * Saturn opposition
 */
const soB = [
  [-0.0209, 0.0006, 0.00023],
  [4.5795, -0.0312, -0.00017],
  [1.1462, -0.0351, 0.00011],
  [0.0985, -0.0015],
  [0.0733, -0.0031, 0.00001],
  [0.0025, -0.0001],
  [0.005, -0.0002],
  [0, -0.0337, 0.00018],
  [-0.851, 0.0044, 0.00068],
  [0, -0.0064, 0.00004],
  [0.2397, -0.0012, -0.00008],
  [0, -0.001],
  [0.1245, 0.0006],
  [0, 0.0024, -0.00003],
  [0.0477, -0.0005, -0.00006]
]

/**
 * Saturn conjunction
 */
const scB = [
  [0.0172, -0.0006, 0.00023],
  [-8.5885, 0.0411, 0.00020],
  [-1.147, 0.0352, -0.00011],
  [0.3331, -0.0034, -0.00001],
  [0.1145, -0.0045, 0.00002],
  [-0.0169, 0.0002],
  [-0.0109, 0.0004],
  [0, -0.0337, 0.00018],
  [-0.851, 0.0044, 0.00068],
  [0, -0.0064, 0.00004],
  [0.2397, -0.0012, -0.00008],
  [0, -0.001],
  [0.1245, 0.0006],
  [0, 0.0024, -0.00003],
  [0.0477, -0.0005, -0.00006]
]

/**
 * Uranus opposition
 */
const uoB = [
  [0.0844, -0.0006],
  [-0.1048, 0.0246],
  [-5.1221, 0.0104, 0.00003],
  [-0.1428, 0.0005],
  [-0.0148, -0.0013],
  [0],
  [0.0055],
  [0],
  [0.885],
  [0],
  [0.2153]
]

/**
 * Neptune opposition [
 */
const noB = [
  [-0.014, 0, 0.00001],
  [-1.3486, 0.001, 0.00001],
  [0.8597, 0.0037],
  [-0.0082, -0.0002, 0.00001],
  [0.0037, -0.0003],
  [0],
  [-0.5964],
  [0],
  [0.0728]
]

/**
 * Table 36.C, p. 259
 */

/**
 * Mercury east time correction
 */
const met = [
  [-21.6106, 0.0002],
  [-1.9803, -0.006, 0.00001],
  [1.4151, -0.0072, -0.00001],
  [0.5528, -0.0005, -0.00001],
  [0.2905, 0.0034, 0.00001],
  [-0.1121, -0.0001, 0.00001],
  [-0.0098, -0.0015],
  [0.0192],
  [0.0111, 0.0004],
  [-0.0061],
  [-0.0032, -0.0001]
]

/**
 * Mercury east elongation
 */
const mee = [
  [22.4697],
  [-4.2666, 0.0054, 0.00002],
  [-1.8537, -0.0137],
  [0.3598, 0.0008, -0.00001],
  [-0.068, 0.0026],
  [-0.0524, -0.0003],
  [0.0052, -0.0006],
  [0.0107, 0.0001],
  [-0.0013, 0.0001],
  [-0.0021],
  [0.0003]
]

/**
 * Mercury west time correction
 */
const mwt = [
  [21.6249, -0.0002],
  [0.1306, 0.0065],
  [-2.7661, -0.0011, 0.00001],
  [0.2438, -0.0024, -0.00001],
  [0.5767, 0.0023],
  [0.1041],
  [-0.0184, 0.0007],
  [-0.0051, -0.0001],
  [0.0048, 0.0001],
  [0.0026],
  [0.0037]
]

/**
 * Mercury west elongation
 */
const mwe = [
  [22.4143, -0.0001],
  [4.3651, -0.0048, -0.00002],
  [2.3787, 0.0121, -0.00001],
  [0.2674, 0.0022],
  [-0.3873, 0.0008, 0.00001],
  [-0.0369, -0.0001],
  [0.0017, -0.0001],
  [0.0059],
  [0.0061, 0.0001],
  [0.0007],
  [-0.0011]
]

/**
 * Table 36.D, p. 261
 */

/**
 * Mars Station 2
 */
const ms2 = [
  [36.7191, 0.0016, 0.00003],
  [-12.6163, 0.0417, -0.00001],
  [20.1218, 0.0379, -0.00006],
  [-1.636, -0.019],
  [-3.9657, 0.0045, 0.00007],
  [1.1546, 0.0029, -0.00003],
  [0.2888, -0.0073, -0.00002],
  [-0.3128, 0.0017, 0.00002],
  [0.2513, 0.0026, -0.00002],
  [-0.0021, -0.0016],
  [-0.1497, -0.0006]
]

export default {
  mean,
  sum,
  ms,
  mercuryInfConj,
  mercurySupConj,
  venusInfConj,
  marsOpp,
  sumA,
  msa,
  jupiterOpp,
  saturnOpp,
  saturnConj,
  uranusOpp,
  neptuneOpp,
  el,
  mercuryEastElongation,
  mercuryWestElongation,
  marsStation2
}
