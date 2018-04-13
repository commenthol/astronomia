/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module refraction
 */
/**
 * Refraction: Chapter 16: Atmospheric Refraction.
 *
 * Functions here assume atmospheric pressure of 1010 mb, temperature of
 * 10°C, and yellow light.
 */
import sexa from './sexagesimal'
const {sin, tan} = Math
const D2R = Math.PI / 180

const gt15true1 = new sexa.Angle(false, 0, 0, 58.294).rad()
const gt15true2 = new sexa.Angle(false, 0, 0, 0.0668).rad()
const gt15app1 = new sexa.Angle(false, 0, 0, 58.276).rad()
const gt15app2 = new sexa.Angle(false, 0, 0, 0.0824).rad()

/**
 * gt15True returns refraction for obtaining true altitude when altitude
 * is greater than 15 degrees (about 0.26 radians.)
 *
 * h0 must be a measured apparent altitude of a celestial body in radians.
 *
 * Result is refraction to be subtracted from h0 to obtain the true altitude
 * of the body.  Unit is radians.
 */
export function gt15True (h0) { // (h0 float64)  float64
  // (16.1) p. 105
  const t = tan(Math.PI / 2 - h0)
  return gt15true1 * t - gt15true2 * t * t * t
}

/**
 * gt15Apparent returns refraction for obtaining apparent altitude when
 * altitude is greater than 15 degrees (about 0.26 radians.)
 *
 * h must be a computed true "airless" altitude of a celestial body in radians.
 *
 * Result is refraction to be added to h to obtain the apparent altitude
 * of the body.  Unit is radians.
 */
export function gt15Apparent (h) { // (h float64)  float64
  // (16.2) p. 105
  const t = tan(Math.PI / 2 - h)
  return gt15app1 * t - gt15app2 * t * t * t
}

/**
 * Bennett returns refraction for obtaining true altitude.
 *
 * h0 must be a measured apparent altitude of a celestial body in radians.
 *
 * Results are accurate to 0.07 arc min from horizon to zenith.
 *
 * Result is refraction to be subtracted from h0 to obtain the true altitude
 * of the body.  Unit is radians.
 */
export function bennett (h0) { // (h0 float64)  float64
  // (16.3) p. 106
  const c1 = D2R / 60
  const c731 = 7.31 * D2R * D2R
  const c44 = 4.4 * D2R
  return c1 / tan(h0 + c731 / (h0 + c44))
}

/**
 * Bennett2 returns refraction for obtaining true altitude.
 *
 * Similar to Bennett, but a correction is applied to give a more accurate
 * result.
 *
 * Results are accurate to 0.015 arc min.  Result unit is radians.
 */
export function bennett2 (h0) { // (h0 float64)  float64
  const cMin = 60 / D2R
  const c06 = 0.06 / cMin
  const c147 = 14.7 * cMin * D2R
  const c13 = 13 * D2R
  const R = bennett(h0)
  return R - c06 * sin(c147 * R + c13)
}

/**
 * Saemundsson returns refraction for obtaining apparent altitude.
 *
 * h must be a computed true "airless" altitude of a celestial body in radians.
 *
 * Result is refraction to be added to h to obtain the apparent altitude
 * of the body.
 *
 * Results are consistent with Bennett to within 4 arc sec.
 * Result unit is radians.
 */
export function saemundsson (h) { // (h float64)  float64
  // (16.4) p. 106
  const c102 = 1.02 * D2R / 60
  const c103 = 10.3 * D2R * D2R
  const c511 = 5.11 * D2R
  return c102 / tan(h + c103 / (h + c511))
}

export default {
  gt15True,
  gt15Apparent,
  bennett,
  bennett2,
  saemundsson
}
