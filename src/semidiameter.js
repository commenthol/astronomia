/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module semidiameter
 */
/**
 * Semidiameter: Chapter 55, Semidiameters of the Sun, Moon, and Planets.
 */
import base from './base'
import parallax from './parallax'

/* eslint-disable no-multi-spaces */
/**
 * Standard semidiameters at unit distance of 1 AU.
 * Values are scaled here to radians.
 */
export const Sun               = 959.63 / 3600 * Math.PI / 180
export const Mercury           = 3.36 / 3600 * Math.PI / 180
export const VenusSurface      = 8.34 / 3600 * Math.PI / 180
export const VenusCloud        = 8.41 / 3600 * Math.PI / 180
export const Mars              = 4.68 / 3600 * Math.PI / 180
export const JupiterEquatorial = 98.44 / 3600 * Math.PI / 180
export const JupiterPolar      = 92.06 / 3600 * Math.PI / 180
export const SaturnEquatorial  = 82.73 / 3600 * Math.PI / 180
export const SaturnPolar       = 73.82 / 3600 * Math.PI / 180
export const Uranus            = 35.02 / 3600 * Math.PI / 180
export const Neptune           = 33.50 / 3600 * Math.PI / 180
export const Pluto             = 2.07 / 3600 * Math.PI / 180
export const Moon              = 358473400 / base.AU / 3600 * Math.PI / 180
/* eslint-enable */

/**
 * Semidiameter returns semidiameter at specified distance.
 *
 * When used with S0 values provided, Δ must be observer-body distance in AU.
 * Result will then be in radians.
 */
export function semidiameter (s0, Δ) { // (s0, Δ float64)  float64
  return s0 / Δ
}

/**
 * SaturnApparentPolar returns apparent polar semidiameter of Saturn
 * at specified distance.
 *
 * Argument Δ must be observer-Saturn distance in AU.  Argument B is
 * Saturnicentric latitude of the observer as given by function saturnring.UB()
 * for example.
 *
 * Result is semidiameter in units of package variables SaturnPolar and
 * SaturnEquatorial, nominally radians.
 */
export function aaturnApparentPolar (Δ, B) { // (Δ, B float64)  float64
  let k = SaturnPolar / SaturnEquatorial
  k = 1 - k * k
  const cB = Math.cos(B)
  return SaturnEquatorial / Δ * Math.sqrt(1 - k * cB * cB)
}

/**
 * MoonTopocentric returns observed topocentric semidiameter of the Moon.
 *
 *  Δ is distance to Moon in AU.
 *  δ is declination of Moon in radians.
 *  H is hour angle of Moon in radians.
 *  ρsφʹ, ρcφʹ are parallax constants as returned by
 *      globe.Ellipsoid.ParallaxConstants, for example.
 *
 * Result is semidiameter in radians.
 */
export function moonTopocentric (Δ, δ, H, ρsφʹ, ρcφʹ) { // (Δ, δ, H, ρsφʹ, ρcφʹ float64)  float64
  const k = 0.272481
  const sπ = Math.sin(parallax.Horizontal(Δ))
  // q computed by (40.6, 40.7) p. 280, ch 40.0
  const [sδ, cδ] = base.sincos(δ)
  const [sH, cH] = base.sincos(H)
  const A = cδ * sH
  const B = cδ * cH - ρcφʹ * sπ
  const C = sδ - ρsφʹ * sπ
  const q = Math.sqrt(A * A + B * B + C * C)
  return k / q * sπ
}

/**
 * MoonTopocentric2 returns observed topocentric semidiameter of the Moon
 * by a less rigorous method.
 *
 * Δ is distance to Moon in AU, h is altitude of the Moon above the observer's
 * horizon in radians.
 *
 * Result is semidiameter in radians.
 */
export function moonTopocentric2 (Δ, h) { // (Δ, h float64)  float64
  return Moon / Δ * (1 + Math.sin(h) * Math.sin(parallax.Horizontal(Δ)))
}

/**
 * AsteroidDiameter returns approximate diameter given absolute magnitude H
 * and albedo A.
 *
 * Result is in km.
 */
export function asteroidDiameter (H, A) { // (H, A float64)  float64
  return Math.pow(10, 3.12 - 0.2 * H - 0.5 * Math.log10(A))
}

/**
 * Asteroid returns semidiameter of an asteroid with a given diameter
 * at given distance.
 *
 * Argument d is diameter in km, Δ is distance in AU.
 *
 * Result is semidiameter in radians.
 */
export function asteroid (d, Δ) { // (d, Δ float64)  float64
  return 0.0013788 * d / Δ / 3600 * Math.PI / 180
}

export default {
  Sun,
  Mercury,
  VenusSurface,
  VenusCloud,
  Mars,
  JupiterEquatorial,
  JupiterPolar,
  SaturnEquatorial,
  SaturnPolar,
  Uranus,
  Neptune,
  Pluto,
  Moon,
  semidiameter,
  aaturnApparentPolar,
  moonTopocentric,
  moonTopocentric2,
  asteroidDiameter,
  asteroid
}
