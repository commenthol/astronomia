"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var M = exports;

/**
 * Ellipsoid represents an ellipsoid of revolution.
 */

var Ellipsoid = function () {
  /**
   * @param {number} radius - equatorial radius
   * @param {number} flat - ellipsiod flattening
   */
  function Ellipsoid(radius, flat) {
    _classCallCheck(this, Ellipsoid);

    this.radius = radius;
    this.flat = flat;
  }

  /** A is a common identifier for equatorial radius. */


  _createClass(Ellipsoid, [{
    key: "A",
    value: function A() {
      return this.radius;
    }

    /** B is a common identifier for polar radius. */

  }, {
    key: "B",
    value: function B() {
      return this.radius * (1 - this.flat);
    }

    /** eccentricity of a meridian. */

  }, {
    key: "eccentricity",
    value: function eccentricity() {
      return Math.sqrt((2 - this.flat) * this.flat);
    }

    /**
     * parallaxConstants computes parallax constants ρ sin φ′ and ρ cos φ′.
     *
     * Arguments are geographic latitude φ in radians and height h
     * in meters above the ellipsoid.
     *
     * @param {number} φ - geographic latitude in radians
     * @param {number} h - height in meters above the ellipsoid
     * @return {number[]} [ρ sin φ′, ρ cos φ] parallax constants
     */

  }, {
    key: "parallaxConstants",
    value: function parallaxConstants(φ, h) {
      var boa = 1 - this.flat;
      var su = Math.sin(Math.atan(boa * Math.tan(φ)));
      var cu = Math.cos(Math.atan(boa * Math.tan(φ)));
      var s = Math.sin(φ);
      var c = Math.cos(φ);
      var hoa = h * 1e-3 / this.radius;
      // (s, c float)
      return [su * boa + hoa * s, cu + hoa * c];
    }

    /**
     * rho is distance from Earth center to a point on the ellipsoid.
     *
     * Result unit is fraction of the equatorial radius.
     * @param {number} φ - geographic latitude in radians
     * @returns {number} // TODO
     */

  }, {
    key: "rho",
    value: function rho(φ) {
      // Magic numbers...
      return 0.9983271 + 0.0016764 * Math.cos(2 * φ) - 0.0000035 * Math.cos(4 * φ);
    }

    /**
     * radiusAtLatitude returns the radius of the circle that is the parallel of
     * latitude at φ.
     *
     * Result unit is Km.
     *
     * @param {number} φ
     * @return {number} radius in km
     */

  }, {
    key: "radiusAtLatitude",
    value: function radiusAtLatitude(φ) {
      var s = Math.sin(φ);
      var c = Math.cos(φ);
      return this.A() * c / Math.sqrt(1 - (2 - this.flat) * this.flat * s * s);
    }

    /**
     * radiusOfCurvature of meridian at latitude φ.
     *
     * Result unit is Km.
     *
     * @param {number} φ
     * @return {number} radius in km
     */

  }, {
    key: "radiusOfCurvature",
    value: function radiusOfCurvature(φ) {
      var s = Math.sin(φ);
      var e2 = (2 - this.flat) * this.flat;
      return this.A() * (1 - e2) / Math.pow(1 - e2 * s * s, 1.5);
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

  }, {
    key: "distance",
    value: function distance(c1, c2) {
      // From AA, ch 11, p 84.
      var _sincos = sincos2((c1.lat + c2.lat) / 2),
          _sincos2 = _slicedToArray(_sincos, 2),
          s2f = _sincos2[0],
          c2f = _sincos2[1];

      var _sincos3 = sincos2((c1.lat - c2.lat) / 2),
          _sincos4 = _slicedToArray(_sincos3, 2),
          s2g = _sincos4[0],
          c2g = _sincos4[1];

      var _sincos5 = sincos2((c1.lon - c2.lon) / 2),
          _sincos6 = _slicedToArray(_sincos5, 2),
          s2λ = _sincos6[0],
          c2λ = _sincos6[1];

      var s = s2g * c2λ + c2f * s2λ;
      var c = c2g * c2λ + s2f * s2λ;
      var ω = Math.atan(Math.sqrt(s / c));
      var r = Math.sqrt(s * c) / ω;
      var d = 2 * ω * this.radius;
      var h1 = (3 * r - 1) / (2 * c);
      var h2 = (3 * r + 1) / (2 * s);
      return d * (1 + this.flat * (h1 * s2f * c2g - h2 * c2f * s2g));
    }
  }]);

  return Ellipsoid;
}();

M.Ellipsoid = Ellipsoid;

/** IAU 1976 values.  Radius in Km. */
M.Earth76 = new Ellipsoid(6378.14, 1 / 298.257);

/**
 * RotationRate1996_5 is the rotational angular velocity of the Earth
 * with respect to the stars at the epoch 1996.5.
 *
 * Unit is radian/second.
 */
M.RotationRate1996_5 = 7.292114992e-5;

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
  return rp * Math.PI / 180;
};

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
  return rm * Math.PI / 180;
};

/**
 * geocentricLatitudeDifference returns geographic latitude - geocentric
 * latitude (φ - φ′) with given geographic latitude (φ).
 *
 * Units are radians.
 * @param {number} φ
 * @returns {number} difference in Deg
 */
M.geocentricLatitudeDifference = function (φ) {
  // This appears to be an approximation with hard coded magic numbers.
  // No explanation is given in the text. The ellipsoid is not specified.
  // Perhaps the approximation works well enough for all ellipsoids?
  return (692.73 * Math.sin(2 * φ) - 1.16 * Math.sin(4 * φ)) * Math.PI / (180 * 3600);
};

/**
 * Coord represents geographic coordinates on the Earth.
 *
 * Longitude is measured positively westward from the Greenwich meridian.
 */

var Coord =
/**
 * @param {number} lat - latitude (φ) in radians
 * @param {number} lon - longitude (ψ, or L) in radians (measured positively westward)
 */
function Coord() {
  var lat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var lon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  _classCallCheck(this, Coord);

  this.lat = lat;
  this.lon = lon;
};

M.Coord = Coord;

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
  var s1 = Math.sin(p1.lat);
  var c1 = Math.cos(p1.lat);
  var s2 = Math.sin(p2.lat);
  var c2 = Math.cos(p2.lat);
  return s1 * s2 + c1 * c2 * Math.cos(p1.lon - p2.lon);
};

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
  return 6371 * d;
};

/**
 * @private
 */
function sincos2(x) {
  var s = Math.sin(x);
  var c = Math.cos(x);
  return [s * s, c * c];
}