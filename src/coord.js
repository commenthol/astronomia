/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module coord
 */
/**
 * Coord: Chapter 13, Transformation of Coordinates.
 *
 * Transforms in this package are provided in two forms, function and method.
 * The results of the two forms should be identical.
 *
 * The function forms pass all arguments and results as single values.  These
 * forms are best used when you are transforming a single pair of coordinates
 * and wish to avoid memory allocation.
 *
 * The method forms take and return pointers to structs.  These forms are best
 * used when you are transforming multiple coordinates and can reuse one or
 * more of the structs.  In this case reuse of structs will minimize
 * allocations, and the struct pointers will pass more efficiently on the
 * stack.  These methods transform their arguments, placing the result in
 * the receiver.  The receiver is then returned for convenience.
 *
 * A number of the functions take sine and cosine of the obliquity of the
 * ecliptic.  This becomes an advantage when you doing multiple transformations
 * with the same obliquity.  The efficiency of computing sine and cosine once
 * and reuse these values far outweighs the overhead of passing one number as
 * opposed to two.
 */

const base = require('./base')
const sexa = require('./sexagesimal')

const M = exports

/**
* Ecliptic coordinates are referenced to the plane of the ecliptic.
*/
class Ecliptic {
  /**
   * IMPORTANT: Longitudes are measured *positively* westwards
   * e.g. Washington D.C. +77°04; Vienna -16°23'
   * @param {Number} lon - Longitude (gl) in radians
   * @param {Number} lat - Latitude (gb) in radians
   */
  constructor (lon, lat) {
    if (typeof lon === 'object') {
      lat = lon.lat
      lon = lon.lon
    }
    this.lon = lon || 0
    this.lat = lat || 0
  }

  /**
   * converts ecliptic coordinates to equatorial coordinates.
   * @param {Number} ge - Obliquity
   * @returns {Equatorial}
   */
  toEquatorial (ge) {
    let [gesin, gecos] = base.sincos(ge)
    let [sgb, cgb] = base.sincos(this.lat)
    let [sgl, cgl] = base.sincos(this.lon)
    let ra = Math.atan2(sgl * gecos - (sgb / cgb) * gesin, cgl) // (13.3) p. 93
    if (ra < 0) {
      ra += 2 * Math.PI
    }
    let dec = Math.asin(sgb * gecos + cgb * gesin * sgl) // (13.4) p. 93
    return new Equatorial(ra, dec)
  }
}
M.Ecliptic = Ecliptic

/**
 * Equatorial coordinates are referenced to the Earth's rotational axis.
 */
class Equatorial {
  /**
   * @param {Number} ra - (float) Right ascension (ga) in radians
   * @param {Number} dec - (float) Declination (gd) in radians
   */
  constructor (ra = 0, dec = 0) {
    this.ra = ra
    this.dec = dec
  }

  /**
   * EqToEcl converts equatorial coordinates to ecliptic coordinates.
   * @param {Number} ge - Obliquity
   * @returns {Ecliptic}
   */
  toEcliptic (ge) {
    let [gesin, gecos] = base.sincos(ge)
    let [sga, cga] = base.sincos(this.ra)
    let [sgd, cgd] = base.sincos(this.dec)
    let lon = Math.atan2(sga * gecos + (sgd / cgd) * gesin, cga) // (13.1) p. 93
    let lat = Math.asin(sgd * gecos - cgd * gesin * sga)        // (13.2) p. 93
    return new Ecliptic(lon, lat)
  }

  /**
   * EqToHz computes Horizontal coordinates from equatorial coordinates.
   *
   * Argument g is the location of the observer on the Earth.  Argument st
   * is the sidereal time at Greenwich.
   *
   * Sidereal time must be consistent with the equatorial coordinates.
   * If coordinates are apparent, sidereal time must be apparent as well.
   *
   * @param {Equatorial} eq - equatorial coordinates (right ascension, declination)
   * @param {globe.Coord} g - coordinates of observer on Earth
   * @param {Number} st - sidereal time at Greenwich at time of observation
   * @returns {Horizontal}
   */
  toHorizontal (g, st) {
    let H = new sexa.Time(st).rad() - g.lon - this.ra
    let [sH, cH] = base.sincos(H)
    let [sgf, cgf] = base.sincos(g.lat)
    let [sgd, cgd] = base.sincos(this.dec)
    let azimuth = Math.atan2(sH, cH * sgf - (sgd / cgd) * cgf) // (13.5) p. 93
    let altitude = Math.asin(sgf * sgd + cgf * cgd * cH) // (13.6) p. 93
    return new Horizontal(azimuth, altitude)
  }

  /**
   * EqToGal converts equatorial coordinates to galactic coordinates.
   *
   * Equatorial coordinates must be referred to the standard equinox of B1950.0.
   * For conversion to B1950, see package precess and utility functions in
   * package "common".
   *
   * @param {Equatorial} eq
   * @returns {Galactic}
   */
  toGalactic () {
    let [sdga, cdga] = base.sincos(galacticNorth1950.ra - this.ra)
    let [sggd, cggd] = base.sincos(galacticNorth1950.dec)
    let [sgd, cgd] = base.sincos(this.dec)
    let x = Math.atan2(sdga, cdga * sggd - (sgd / cgd) * cggd) // (13.7) p. 94
    // (galactic0Lon1950 + 1.5*math.Pi) = magic number of 303 deg
    let lon = (galactic0Lon1950 + 1.5 * Math.PI - x) % (2 * Math.PI) // (13.8) p. 94
    let lat = Math.asin(sgd * sggd + cgd * cggd * cdga)
    return new Galactic(lon, lat)
  }
}
M.Equatorial = Equatorial

/**
 * Horizontal coordinates are referenced to the local horizon of an observer
 * on the surface of the Earth.
 * @param {Number} az - Azimuth (A) in radians
 * @param {Number} alt - Altitude (h) in radians
 */
class Horizontal {
  constructor (az = 0, alt = 0) {
    this.az = az
    this.alt = alt
  }

  /**
   * transforms horizontal coordinates to equatorial coordinates.
   *
   * Sidereal time must be consistent with the equatorial coordinates.
   * If coordinates are apparent, sidereal time must be apparent as well.
   * @param {globe.Coord} g - coordinates of observer on Earth (lat, lon)
   * @param {Number} st - sidereal time at Greenwich at time of observation.
   * @returns {Equatorial} (right ascension, declination)
   */
  toEquatorial (g, st) {
    let [sA, cA] = base.sincos(this.az)
    let [sh, ch] = base.sincos(this.alt)
    let [sgf, cgf] = base.sincos(g.lat)
    let H = Math.atan2(sA, cA * sgf + sh / ch * cgf)
    let ra = base.pmod(new sexa.Time(st).rad() - g.lon - H, 2 * Math.PI)
    let dec = Math.asin(sgf * sh - cgf * ch * cA)
    return new Equatorial(ra, dec)
  }
}
M.Horizontal = Horizontal

/**
 * Galactic coordinates are referenced to the plane of the Milky Way.
 * @param {Number} lon - Longitude (l) in radians
 * @param {Number} lat - Latitude (b) in radians
 */
class Galactic {
  constructor (lon = 0, lat = 0) {
    this.lon = lon
    this.lat = lat
  }

  /**
   * GalToEq converts galactic coordinates to equatorial coordinates.
   *
   * Resulting equatorial coordinates will be referred to the standard equinox of
   * B1950.0.  For subsequent conversion to other epochs, see package precess and
   * utility functions in package meeus.
   *
   * @returns {Equatorial} (right ascension, declination)
   */
  toEquatorial () {
    // (-galactic0Lon1950 - math.Pi/2) = magic number of -123 deg
    var [sdLon, cdLon] = base.sincos(this.lon - galactic0Lon1950 - Math.PI / 2)
    var [sggd, cggd] = base.sincos(galacticNorth1950.dec)
    var [sb, cb] = base.sincos(this.lat)
    var y = Math.atan2(sdLon, cdLon * sggd - (sb / cb) * cggd)
    // (galacticNorth1950.RA.Rad() - math.Pi) = magic number of 12.25 deg
    var ra = base.pmod(y + galacticNorth1950.ra - Math.PI, 2 * Math.PI)
    var dec = Math.asin(sb * sggd + cb * cggd * cdLon)
    return new Equatorial(ra, dec)
  }
}
M.Galactic = Galactic

/**
* equatorial coords for galactic north
* IAU B1950.0 coordinates of galactic North Pole
*/
const galacticNorth1950 = M.galacticNorth1950 = M.galacticNorth = new Equatorial(
  new sexa.RA(12, 49, 0).rad(),
  27.4 * Math.PI / 180
)

/**
* Galactic Longitude 0°
* Meeus gives 33 as the origin of galactic longitudes relative to the
* ascending node of of the galactic equator.  33 + 90 = 123, the IAU
* value for origin relative to the equatorial pole.
*/
const galactic0Lon1950 = M.galactic0Lon1950 = M.galacticLon0 = 33 * Math.PI / 180
