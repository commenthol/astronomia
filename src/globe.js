/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module globe
 */
/**
 * Globe: Chapter 11, The Earth's Globe.
 *
 * Globe contains functions concerning the surface of the Earth idealized as
 * an ellipsoid of revolution.
 */
const M = exports

/**
 * Ellipsoid represents an ellipsoid of revolution.
 */
class Ellipsoid {
  /**
   * @param {number} radius - equatorial radius
   * @param {number} flat - ellipsiod flattening
   */
  constructor (radius, flat) {
    this.radius = radius
    this.flat = flat
  }

  /** A is a common identifier for equatorial radius. */
  A () {
    return this.radius
  }

  /** B is a common identifier for polar radius. */
  B () {
    return this.radius * (1 - this.flat)
  }

  /** eccentricity of a meridian. */
  eccentricity () {
    return Math.sqrt((2 - this.flat) * this.flat)
  }

  /**
   * parallaxConstants computes parallax constants gr sin gf′ and gr cos gf′.
   *
   * Arguments are geographic latitude gf in radians and height h
   * in meters above the ellipsoid.
   *
   * @param {number} gf - geographic latitude in radians
   * @param {number} h - height in meters above the ellipsoid
   * @return {number[]} [gr sin gf′, gr cos gf] parallax constants
   */
  parallaxConstants (gf, h) {
    var boa = 1 - this.flat
    var su = Math.sin(Math.atan(boa * Math.tan(gf)))
    var cu = Math.cos(Math.atan(boa * Math.tan(gf)))
    var s = Math.sin(gf)
    var c = Math.cos(gf)
    var hoa = h * 1e-3 / this.radius
    // (s, c float)
    return [su * boa + hoa * s, cu + hoa * c]
  }

  /**
   * rho is distance from Earth center to a point on the ellipsoid.
   *
   * Result unit is fraction of the equatorial radius.
   * @param {number} gf - geographic latitude in radians
   * @returns {number} // TODO
   */
  rho (gf) {
    // Magic numbers...
    return 0.9983271 + 0.0016764 * Math.cos(2 * gf) - 0.0000035 * Math.cos(4 * gf)
  }

  /**
   * radiusAtLatitude returns the radius of the circle that is the parallel of
   * latitude at gf.
   *
   * Result unit is Km.
   *
   * @param {number} gf
   * @return {number} radius in km
   */
  radiusAtLatitude (gf) {
    var s = Math.sin(gf)
    var c = Math.cos(gf)
    return this.A() * c / Math.sqrt(1 - (2 - this.flat) * this.flat * s * s)
  }

  /**
   * radiusOfCurvature of meridian at latitude gf.
   *
   * Result unit is Km.
   *
   * @param {number} gf
   * @return {number} radius in km
   */
  radiusOfCurvature (gf) {
    var s = Math.sin(gf)
    var e2 = (2 - this.flat) * this.flat
    return this.A() * (1 - e2) / Math.pow(1 - e2 * s * s, 1.5)
  }

  /**
   * distance is distance between two points measured along the surface
   * of an ellipsoid.
   *
   * Accuracy is much better than that of approxAngularDistance or
   * approxLinearDistance.
   *
   * Result unit is Km.
   *
   * @param {Coords} c1
   * @param {Coords} c2
   * @return {number} radius in km
   */
  distance (c1, c2) {
    // From AA, ch 11, p 84.
    var [s2f, c2f] = sincos2((c1.lat + c2.lat) / 2)
    var [s2g, c2g] = sincos2((c1.lat - c2.lat) / 2)
    var [s2gl, c2gl] = sincos2((c1.lon - c2.lon) / 2)
    var s = s2g * c2gl + c2f * s2gl
    var c = c2g * c2gl + s2f * s2gl
    var gw = Math.atan(Math.sqrt(s / c))
    var r = Math.sqrt(s * c) / gw
    var d = 2 * gw * this.radius
    var h1 = (3 * r - 1) / (2 * c)
    var h2 = (3 * r + 1) / (2 * s)
    return d * (1 + this.flat * (h1 * s2f * c2g - h2 * c2f * s2g))
  }
}
M.Ellipsoid = Ellipsoid

/** IAU 1976 values.  Radius in Km. */
M.Earth76 = new Ellipsoid(6378.14, 1 / 298.257)

/**
 * RotationRate1996_5 is the rotational angular velocity of the Earth
 * with respect to the stars at the epoch 1996.5.
 *
 * Unit is radian/second.
 */
M.RotationRate1996_5 = 7.292114992e-5

/**
 * oneDegreeOfLongitude returns the length of one degree of longitude.
 *
 * Argument `rp` is the radius in Km of a circle that is a parallel of latitude
 * (as returned by Ellipsoid.radiusAtLatitude.)
 * Result is distance in Km along one degree of the circle.
 *
 * @param {number} rp
 * @return {number} distance in Km
 */
M.oneDegreeOfLongitude = function (rp) {
  return rp * Math.PI / 180
}

/**
 * oneDegreeOfLatitude returns the length of one degree of latitude.
 *
 * Argument `rm` is the radius in Km of curvature along a meridian.
 * (as returned by Ellipsoid.radiusOfCurvature.)
 * Result is distance in Km along one degree of the meridian.
 *
 * @param {number} rm
 * @return {number} distance in Km
 */
M.oneDegreeOfLatitude = function (rm) {
  return rm * Math.PI / 180
}

/**
 * geocentricLatitudeDifference returns geographic latitude - geocentric
 * latitude (gf - gf′) with given geographic latitude (gf).
 *
 * Units are radians.
 * @param {number} gf
 * @returns {number} difference in Deg
 */
M.geocentricLatitudeDifference = function (gf) {
  // This appears to be an approximation with hard coded magic numbers.
  // No explanation is given in the text. The ellipsoid is not specified.
  // Perhaps the approximation works well enough for all ellipsoids?
  return (692.73 * Math.sin(2 * gf) - 1.16 * Math.sin(4 * gf)) * Math.PI / (180 * 3600)
}

/**
 * Coord represents geographic coordinates on the Earth.
 *
 * Longitude is measured positively westward from the Greenwich meridian.
 */
class Coord {
  /**
   * @param {number} lat - latitude (gf) in radians
   * @param {number} lon - longitude (gps, or L) in radians (measured positively westward)
   */
  constructor (lat = 0, lon = 0) {
    this.lat = lat
    this.lon = lon
  }
}
M.Coord = Coord

/**
 * approxAngularDistance returns the cosine of the angle between two points.
 *
 * The accuracy deteriorates at small angles.
 *
 * @param {Coord} p1 - Point 1
 * @param {Coord} p2 - Point 2
 * @returns {number} cosine `cos` of the angle between two points.
 * Use `d = Math.acos(cos)` to obtain geocentric angular distance in radians
 */
M.approxAngularDistance = function (p1, p2) {
  var s1 = Math.sin(p1.lat)
  var c1 = Math.cos(p1.lat)
  var s2 = Math.sin(p2.lat)
  var c2 = Math.cos(p2.lat)
  return s1 * s2 + c1 * c2 * Math.cos(p1.lon - p2.lon)
}

/**
 * approxLinearDistance computes a distance across the surface of the Earth.
 *
 * Approximating the Earth as a sphere, the function takes a geocentric angular
 * distance in radians and returns the corresponding linear distance in Km.
 *
 * @param {number} d - geocentric angular distance in radians
 * @returns linear distance in Km
 */
M.approxLinearDistance = function (d) {
  return 6371 * d
}

/**
 * @private
 */
function sincos2 (x) {
  var s = Math.sin(x)
  var c = Math.cos(x)
  return [s * s, c * c]
}
