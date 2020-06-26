/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module parallactic
 */
/**
 * Parallactic: Chapter 14, The Parallactic Angle, and three other Topics.
 */

import base from './base'

/**
 * ParallacticAngle returns parallactic angle of a celestial object.
 *
 *  φ is geographic latitude of observer.
 *  δ is declination of observed object.
 *  H is hour angle of observed object.
 *
 * All angles including result are in radians.
 */
export function parallacticAngle (φ, δ, H) { // (φ, δ, H float64)  float64
  const [sδ, cδ] = base.sincos(δ)
  const [sH, cH] = base.sincos(H)
  return Math.atan2(sH, Math.tan(φ) * cδ - sδ * cH) // (14.1) p. 98
}

/**
 * ParallacticAngleOnHorizon is a special case of ParallacticAngle.
 *
 * The hour angle is not needed as an input and the math inside simplifies.
 */
export function parallacticAngleOnHorizon (φ, δ) { // (φ, δ float64)  float64
  return Math.acos(Math.sin(φ) / Math.cos(δ))
}

/**
 * EclipticAtHorizon computes how the plane of the ecliptic intersects
 * the horizon at a given local sidereal time as observed from a given
 * geographic latitude.
 *
 *  ε is obliquity of the ecliptic.
 *  φ is geographic latitude of observer.
 *  θ is local sidereal time expressed as an hour angle.
 *
 *  λ1 and λ2 are ecliptic longitudes where the ecliptic intersects the horizon.
 *  I is the angle at which the ecliptic intersects the horizon.
 *
 * All angles, arguments and results, are in radians.
 */
export function eclipticAtHorizon (ε, φ, θ) { // (ε, φ, θ float64)  (λ1, λ2, I float64)
  const [sε, cε] = base.sincos(ε)
  const [sφ, cφ] = base.sincos(φ)
  const [sθ, cθ] = base.sincos(θ)
  let λ = Math.atan2(-cθ, sε * (sφ / cφ) + cε * sθ) // (14.2) p. 99
  if (λ < 0) {
    λ += Math.PI
  }
  return [λ, λ + Math.PI, Math.acos(cε * sφ - sε * cφ * sθ)] // (14.3) p. 99
}

/**
 * EclipticAtEquator computes the angle between the ecliptic and the parallels
 * of ecliptic latitude at a given ecliptic longitude.
 *
 * (The function name EclipticAtEquator is for consistency with the Meeus text,
 * and works if you consider the equator a nominal parallel of latitude.)
 *
 *  λ is ecliptic longitude.
 *  ε is obliquity of the ecliptic.
 *
 * All angles in radians.
 */
export function eclipticAtEquator (λ, ε) { // (λ, ε float64)  float64
  return Math.atan(-Math.cos(λ) * Math.tan(ε))
}

/**
 * DiurnalPathAtHorizon computes the angle of the path a celestial object
 * relative to the horizon at the time of its rising or setting.
 *
 *  δ is declination of the object.
 *  φ is geographic latitude of observer.
 *
 * All angles in radians.
 */
export function diurnalPathAtHorizon (δ, φ) { // (δ, φ float64)  (J float64)
  const tφ = Math.tan(φ)
  const b = Math.tan(δ) * tφ
  const c = Math.sqrt(1 - b * b)
  return Math.atan(c * Math.cos(δ) / tφ)
}

export default {
  parallacticAngle,
  parallacticAngleOnHorizon,
  eclipticAtHorizon,
  eclipticAtEquator,
  diurnalPathAtHorizon
}
