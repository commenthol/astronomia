/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module semidiameter
 */
/**
 * Semidiameter: Chapter 55, Semidiameters of the Sun, Moon, and Planets.
 */
const base = require('./base')
const parallax = require('./parallax')

const M = exports

/* eslint-disable no-multi-spaces */
/**
 * Standard semidiameters at unit distance of 1 AU.
 * Values are scaled here to radians.
 */
M.Sun               = 959.63 / 3600 * Math.PI / 180
M.Mercury           = 3.36 / 3600 * Math.PI / 180
M.VenusSurface      = 8.34 / 3600 * Math.PI / 180
M.VenusCloud        = 8.41 / 3600 * Math.PI / 180
M.Mars              = 4.68 / 3600 * Math.PI / 180
M.JupiterEquatorial = 98.44 / 3600 * Math.PI / 180
M.JupiterPolar      = 92.06 / 3600 * Math.PI / 180
M.SaturnEquatorial  = 82.73 / 3600 * Math.PI / 180
M.SaturnPolar       = 73.82 / 3600 * Math.PI / 180
M.Uranus            = 35.02 / 3600 * Math.PI / 180
M.Neptune           = 33.50 / 3600 * Math.PI / 180
M.Pluto             = 2.07 / 3600 * Math.PI / 180
M.Moon              = 358473400 / base.AU / 3600 * Math.PI / 180
/* eslint-enable */

/**
 * Semidiameter returns semidiameter at specified distance.
 *
 * When used with S0 values provided, gD must be observer-body distance in AU.
 * Result will then be in radians.
 */
M.semidiameter = function (s0, gD) { // (s0, gD float64)  float64
  return s0 / gD
}

/**
 * SaturnApparentPolar returns apparent polar semidiameter of Saturn
 * at specified distance.
 *
 * Argument gD must be observer-Saturn distance in AU.  Argument B is
 * Saturnicentric latitude of the observer as given by function saturnring.UB()
 * for example.
 *
 * Result is semidiameter in units of package variables SaturnPolar and
 * SaturnEquatorial, nominally radians.
 */
M.aaturnApparentPolar = function (gD, B) { // (gD, B float64)  float64
  let k = M.SaturnPolar / M.SaturnEquatorial
  k = 1 - k * k
  let cB = Math.cos(B)
  return M.SaturnEquatorial / gD * Math.sqrt(1 - k * cB * cB)
}

/**
 * MoonTopocentric returns observed topocentric semidiameter of the Moon.
 *
 *  gD is distance to Moon in AU.
 *  gd is declination of Moon in radians.
 *  H is hour angle of Moon in radians.
 *  grsgfʹ, grcgfʹ are parallax constants as returned by
 *      globe.Ellipsoid.ParallaxConstants, for example.
 *
 * Result is semidiameter in radians.
 */
M.moonTopocentric = function (gD, gd, H, grsgfʹ, grcgfʹ) { // (gD, gd, H, grsgfʹ, grcgfʹ float64)  float64
  const k = 0.272481
  let sgp = Math.sin(parallax.Horizontal(gD))
    // q computed by (40.6, 40.7) p. 280, ch 40.0
  let [sgd, cgd] = base.sincos(gd)
  let [sH, cH] = base.sincos(H)
  let A = cgd * sH
  let B = cgd * cH - grcgfʹ * sgp
  let C = sgd - grsgfʹ * sgp
  let q = Math.sqrt(A * A + B * B + C * C)
  return k / q * sgp
}

/**
 * MoonTopocentric2 returns observed topocentric semidiameter of the Moon
 * by a less rigorous method.
 *
 * gD is distance to Moon in AU, h is altitude of the Moon above the observer's
 * horizon in radians.
 *
 * Result is semidiameter in radians.
 */
M.moonTopocentric2 = function (gD, h) { // (gD, h float64)  float64
  return M.Moon / gD * (1 + Math.sin(h) * Math.sin(parallax.Horizontal(gD)))
}

/**
 * AsteroidDiameter returns approximate diameter given absolute magnitude H
 * and albedo A.
 *
 * Result is in km.
 */
M.asteroidDiameter = function (H, A) { // (H, A float64)  float64
  return Math.pow(10, 3.12 - 0.2 * H - 0.5 * Math.log10(A))
}

/**
 * Asteroid returns semidiameter of an asteroid with a given diameter
 * at given distance.
 *
 * Argument d is diameter in km, gD is distance in AU.
 *
 * Result is semidiameter in radians.
 */
M.asteroid = function (d, gD) { // (d, gD float64)  float64
  return 0.0013788 * d / gD / 3600 * Math.PI / 180
}
