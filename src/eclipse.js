/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module eclipse
 */
/**
 * Eclipse: Chapter 54, Eclipses.
 */
const base = require('./base')
const moonphase = require('./moonphase')

const M = exports

/**
 * @private
 */
const g = function (k, jm, c1, c2) { // (k, jm, c1, c2 float64)  (eclipse bool, jdeMax, gg, u, Mʹ float64)
  const ck = 1 / 1236.85
  const p = Math.PI / 180
  let T = k * ck
  let F = base.horner(T, 160.7108 * p, 390.67050284 * p / ck,
    -0.0016118 * p, -0.00000227 * p, 0.000000011 * p)
  if (Math.abs(Math.sin(F)) > 0.36) {
    return // no eclipse
  }
  let eclipse = true
  let E = base.horner(T, 1, -0.002516, -0.0000074)
  let M = base.horner(T, 2.5534 * p, 29.1053567 * p / ck,
    -0.0000014 * p, -0.00000011 * p)
  let Mʹ = base.horner(T, 201.5643 * p, 385.81693528 * p / ck,
    0.0107582 * p, 0.00001238 * p, -0.000000058 * p)
  let gw = base.horner(T, 124.7746 * p, -1.56375588 * p / ck,
    0.0020672 * p, 0.00000215 * p)
  let sgw = Math.sin(gw)
  let F1 = F - 0.02665 * p * sgw
  let A1 = base.horner(T, 299.77 * p, 0.107408 * p / ck, -0.009173 * p)
  // (54.1) p. 380
  let jdeMax = jm +
    c1 * Math.sin(Mʹ) +
    c2 * Math.sin(M) * E +
    0.0161 * Math.sin(2 * Mʹ) +
    -0.0097 * Math.sin(2 * F1) +
    0.0073 * Math.sin(Mʹ - M) * E +
    -0.005 * Math.sin(Mʹ + M) * E +
    -0.0023 * Math.sin(Mʹ - 2 * F1) +
    0.0021 * Math.sin(2 * M) * E +
    0.0012 * Math.sin(Mʹ + 2 * F1) +
    0.0006 * Math.sin(2 * Mʹ + M) * E +
    -0.0004 * Math.sin(3 * Mʹ) +
    -0.0003 * Math.sin(M + 2 * F1) * E +
    0.0003 * Math.sin(A1) +
    -0.0002 * Math.sin(M - 2 * F1) * E +
    -0.0002 * Math.sin(2 * Mʹ - M) * E +
    -0.0002 * sgw
  let P = 0.207 * Math.sin(M) * E +
    0.0024 * Math.sin(2 * M) * E +
    -0.0392 * Math.sin(Mʹ) +
    0.0116 * Math.sin(2 * Mʹ) +
    -0.0073 * Math.sin(Mʹ + M) * E +
    0.0067 * Math.sin(Mʹ - M) * E +
    0.0118 * Math.sin(2 * F1)
  let Q = 5.2207 +
    -0.0048 * Math.cos(M) * E +
    0.002 * Math.cos(2 * M) * E +
    -0.3299 * Math.cos(Mʹ) +
    -0.006 * Math.cos(Mʹ + M) * E +
    0.0041 * Math.cos(Mʹ - M) * E
  let [sF1, cF1] = base.sincos(F1)
  let W = Math.abs(cF1)
  let gg = (P * cF1 + Q * sF1) * (1 - 0.0048 * W)
  let u = 0.0059 +
    0.0046 * Math.cos(M) * E +
    -0.0182 * Math.cos(Mʹ) +
    0.0004 * Math.cos(2 * Mʹ) +
    -0.0005 * Math.cos(M + Mʹ)
  return [eclipse, jdeMax, gg, u, Mʹ] // (eclipse bool, jdeMax, gg, u, Mʹ float64)
}

/**
 * Eclipse type identifiers returned from Solar and Lunar.
 */
const TYPE = M.TYPE = {
  None: 0,
  Partial: 1,       // for solar eclipses
  Annular: 2,       // solar
  AnnularTotal: 3,  // solar
  Penumbral: 4,     // for lunar eclipses
  Umbral: 5,        // lunar
  Total: 6          // solar or lunar
}

/**
 * Snap returns k at specified quarter q nearest year y.
 * Cut and paste from moonphase.  Time corresponding to k needed in these
 * algorithms but otherwise not meaningful enough to export from moonphase.
 */
const snap = function (y, q) { // (y, q float64)  float64
  let k = (y - 2000) * 12.3685 // (49.2) p. 350
  return Math.floor(k - q + 0.5) + q
}

/**
 * Solar computes quantities related to solar eclipses.
 *
 * Argument year is a decimal year specifying a date.
 *
 * eclipseType will be None, Partial, Annular, AnnularTotal, or Total.
 * If None, none of the other return values may be meaningful.
 *
 * central is true if the center of the eclipse shadow touches the Earth.
 *
 * jdeMax is the jde when the center of the eclipse shadow is closest to the
 * Earth center, in a plane through the center of the Earth.
 *
 * gg is the distance from the eclipse shadow center to the Earth center
 * at time jdeMax.
 *
 * u is the radius of the Moon's umbral cone in the plane of the Earth.
 *
 * p is the radius of the penumbral cone.
 *
 * mag is eclipse magnitude for partial eclipses.  It is not valid for other
 * eclipse types.
 *
 * gg, u, and p are in units of equatorial Earth radii.
 */
M.solar = function (year) { // (year float64)  (eclipseType int, central bool, jdeMax, gg, u, p, mag float64)
  let eclipseType = TYPE.None
  let mag

  let [e, jdeMax, gg, u, _] = g(snap(year, 0), moonphase.meanNew(year), -0.4075, 0.1721) // eslint-disable-line no-unused-vars

  let p = u + 0.5461
  if (!e) {
    return { type: eclipseType } // no eclipse
  }
  let agg = Math.abs(gg)
  if (agg > 1.5433 + u) {
    return { type: eclipseType } // no eclipse
  }
  let central = agg < 0.9972 // eclipse center touches Earth

  if (!central) {
    eclipseType = TYPE.Partial    // most common case
    if (agg < 1.026) {            // umbral cone may touch earth
      if (agg < 0.9972 + Math.abs(u)) { // total or annular
        eclipseType = TYPE.Total  // report total in both cases
      }
    }
  } else if (u < 0) {
    eclipseType = TYPE.Total
  } else if (u > 0.0047) {
    eclipseType = TYPE.Annular
  } else {
    let gwa = 0.00464 * Math.sqrt(1 - gg * gg)
    if (u < gwa) {
      eclipseType = TYPE.AnnularTotal
    } else {
      eclipseType = TYPE.Annular
    }
  }

  if (eclipseType === TYPE.Partial) {
    // (54.2) p. 382
    mag = (1.5433 + u - agg) / (0.5461 + 2 * u)
  }

  return {
    type: eclipseType,
    central: central,
    jdeMax: jdeMax,
    magnitude: mag,
    distance: gg,
    umbral: u,
    penumbral: p
  }
}

/**
 * Lunar computes quantities related to lunar eclipses.
 *
 * Argument year is a decimal year specifying a date.
 *
 * eclipseType will be None, Penumbral, Umbral, or Total.
 * If None, none of the other return values may be meaningful.
 *
 * jdeMax is the jde when the center of the eclipse shadow is closest to the
 * Moon center, in a plane through the center of the Moon.
 *
 * gg is the distance from the eclipse shadow center to the moon center
 * at time jdeMax.
 *
 * gs is the radius of the umbral cone in the plane of the Moon.
 *
 * gr is the radius of the penumbral cone.
 *
 * mag is eclipse magnitude.
 *
 * sd- return values are semidurations of the phases of the eclipse, in days.
 *
 * gg, gs, and gr are in units of equatorial Earth radii.
 */
M.lunar = function (year) { // (year float64)  (eclipseType int, jdeMax, gg, gr, gs, mag, sdTotal, sdPartial, sdPenumbral float64)
  let eclipseType = TYPE.None
  let mag
  let sdTotal
  let sdPartial
  let sdPenumbral

  let [e, jdeMax, gg, u, Mʹ] = g(snap(year, 0.5),
    moonphase.meanFull(year), -0.4065, 0.1727)
  if (!e) {
    return { type: eclipseType }// no eclipse
  }
  let gr = 1.2848 + u
  let gs = 0.7403 - u
  let agg = Math.abs(gg)
  mag = (1.0128 - u - agg) / 0.545 // (54.3) p. 382

  if (mag > 1) {
    eclipseType = TYPE.Total
  } else if (mag > 0) {
    eclipseType = TYPE.Umbral
  } else {
    mag = (1.5573 + u - agg) / 0.545 // (54.4) p. 382
    if (mag < 0) {
      return // no eclipse
    }
    eclipseType = TYPE.Penumbral
  }

  let p = 1.0128 - u
  let t = 0.4678 - u
  let n = 0.5458 + 0.04 * Math.cos(Mʹ)
  let gg2 = gg * gg

  /* eslint-disable no-fallthrough */
  switch (eclipseType) {
    case TYPE.Total: {
      sdTotal = Math.sqrt(t * t - gg2) / n / 24
    }
    case TYPE.Umbral: {
      sdPartial = Math.sqrt(p * p - gg2) / n / 24
    }
    default: {
      let h = 1.5573 + u
      sdPenumbral = Math.sqrt(h * h - gg2) / n / 24
    }
  }
  /* eslint-enable */

  return {
    type: eclipseType,
    jdeMax: jdeMax,
    magnitude: mag,
    distance: gg,
    umbral: gs,
    penumbral: gr,
    sdTotal: sdTotal,
    sdPartial: sdPartial,
    sdPenumbral: sdPenumbral
  }
}
