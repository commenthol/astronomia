'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var base = require('./base');
var sexa = require('./sexagesimal');

var M = exports;

/**
* Ecliptic coordinates are referenced to the plane of the ecliptic.
*/

var Ecliptic = function () {
  /**
   * IMPORTANT: Longitudes are measured *positively* westwards
   * e.g. Washington D.C. +77°04; Vienna -16°23'
   * @param {Number} lon - Longitude (λ) in radians
   * @param {Number} lat - Latitude (β) in radians
   */
  function Ecliptic(lon, lat) {
    _classCallCheck(this, Ecliptic);

    if ((typeof lon === 'undefined' ? 'undefined' : _typeof(lon)) === 'object') {
      lat = lon.lat;
      lon = lon.lon;
    }
    this.lon = lon || 0;
    this.lat = lat || 0;
  }

  /**
   * converts ecliptic coordinates to equatorial coordinates.
   * @param {Number} ε - Obliquity
   * @returns {Equatorial}
   */


  _createClass(Ecliptic, [{
    key: 'toEquatorial',
    value: function toEquatorial(ε) {
      var _base$sincos = base.sincos(ε),
          _base$sincos2 = _slicedToArray(_base$sincos, 2),
          εsin = _base$sincos2[0],
          εcos = _base$sincos2[1];

      var _base$sincos3 = base.sincos(this.lat),
          _base$sincos4 = _slicedToArray(_base$sincos3, 2),
          sβ = _base$sincos4[0],
          cβ = _base$sincos4[1];

      var _base$sincos5 = base.sincos(this.lon),
          _base$sincos6 = _slicedToArray(_base$sincos5, 2),
          sλ = _base$sincos6[0],
          cλ = _base$sincos6[1];

      var ra = Math.atan2(sλ * εcos - sβ / cβ * εsin, cλ); // (13.3) p. 93
      if (ra < 0) {
        ra += 2 * Math.PI;
      }
      var dec = Math.asin(sβ * εcos + cβ * εsin * sλ); // (13.4) p. 93
      return new Equatorial(ra, dec);
    }
  }]);

  return Ecliptic;
}();

M.Ecliptic = Ecliptic;

/**
 * Equatorial coordinates are referenced to the Earth's rotational axis.
 */

var Equatorial = function () {
  /**
   * @param {Number} ra - (float) Right ascension (α) in radians
   * @param {Number} dec - (float) Declination (δ) in radians
   */
  function Equatorial() {
    var ra = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var dec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Equatorial);

    this.ra = ra;
    this.dec = dec;
  }

  /**
   * EqToEcl converts equatorial coordinates to ecliptic coordinates.
   * @param {Number} ε - Obliquity
   * @returns {Ecliptic}
   */


  _createClass(Equatorial, [{
    key: 'toEcliptic',
    value: function toEcliptic(ε) {
      var _base$sincos7 = base.sincos(ε),
          _base$sincos8 = _slicedToArray(_base$sincos7, 2),
          εsin = _base$sincos8[0],
          εcos = _base$sincos8[1];

      var _base$sincos9 = base.sincos(this.ra),
          _base$sincos10 = _slicedToArray(_base$sincos9, 2),
          sα = _base$sincos10[0],
          cα = _base$sincos10[1];

      var _base$sincos11 = base.sincos(this.dec),
          _base$sincos12 = _slicedToArray(_base$sincos11, 2),
          sδ = _base$sincos12[0],
          cδ = _base$sincos12[1];

      var lon = Math.atan2(sα * εcos + sδ / cδ * εsin, cα); // (13.1) p. 93
      var lat = Math.asin(sδ * εcos - cδ * εsin * sα); // (13.2) p. 93
      return new Ecliptic(lon, lat);
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

  }, {
    key: 'toHorizontal',
    value: function toHorizontal(g, st) {
      var H = new sexa.Time(st).rad() - g.lon - this.ra;

      var _base$sincos13 = base.sincos(H),
          _base$sincos14 = _slicedToArray(_base$sincos13, 2),
          sH = _base$sincos14[0],
          cH = _base$sincos14[1];

      var _base$sincos15 = base.sincos(g.lat),
          _base$sincos16 = _slicedToArray(_base$sincos15, 2),
          sφ = _base$sincos16[0],
          cφ = _base$sincos16[1];

      var _base$sincos17 = base.sincos(this.dec),
          _base$sincos18 = _slicedToArray(_base$sincos17, 2),
          sδ = _base$sincos18[0],
          cδ = _base$sincos18[1];

      var azimuth = Math.atan2(sH, cH * sφ - sδ / cδ * cφ); // (13.5) p. 93
      var altitude = Math.asin(sφ * sδ + cφ * cδ * cH); // (13.6) p. 93
      return new Horizontal(azimuth, altitude);
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

  }, {
    key: 'toGalactic',
    value: function toGalactic() {
      var _base$sincos19 = base.sincos(galacticNorth1950.ra - this.ra),
          _base$sincos20 = _slicedToArray(_base$sincos19, 2),
          sdα = _base$sincos20[0],
          cdα = _base$sincos20[1];

      var _base$sincos21 = base.sincos(galacticNorth1950.dec),
          _base$sincos22 = _slicedToArray(_base$sincos21, 2),
          sgδ = _base$sincos22[0],
          cgδ = _base$sincos22[1];

      var _base$sincos23 = base.sincos(this.dec),
          _base$sincos24 = _slicedToArray(_base$sincos23, 2),
          sδ = _base$sincos24[0],
          cδ = _base$sincos24[1];

      var x = Math.atan2(sdα, cdα * sgδ - sδ / cδ * cgδ); // (13.7) p. 94
      // (galactic0Lon1950 + 1.5*math.Pi) = magic number of 303 deg
      var lon = (galactic0Lon1950 + 1.5 * Math.PI - x) % (2 * Math.PI); // (13.8) p. 94
      var lat = Math.asin(sδ * sgδ + cδ * cgδ * cdα);
      return new Galactic(lon, lat);
    }
  }]);

  return Equatorial;
}();

M.Equatorial = Equatorial;

/**
 * Horizontal coordinates are referenced to the local horizon of an observer
 * on the surface of the Earth.
 * @param {Number} az - Azimuth (A) in radians
 * @param {Number} alt - Altitude (h) in radians
 */

var Horizontal = function () {
  function Horizontal() {
    var az = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var alt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Horizontal);

    this.az = az;
    this.alt = alt;
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


  _createClass(Horizontal, [{
    key: 'toEquatorial',
    value: function toEquatorial(g, st) {
      var _base$sincos25 = base.sincos(this.az),
          _base$sincos26 = _slicedToArray(_base$sincos25, 2),
          sA = _base$sincos26[0],
          cA = _base$sincos26[1];

      var _base$sincos27 = base.sincos(this.alt),
          _base$sincos28 = _slicedToArray(_base$sincos27, 2),
          sh = _base$sincos28[0],
          ch = _base$sincos28[1];

      var _base$sincos29 = base.sincos(g.lat),
          _base$sincos30 = _slicedToArray(_base$sincos29, 2),
          sφ = _base$sincos30[0],
          cφ = _base$sincos30[1];

      var H = Math.atan2(sA, cA * sφ + sh / ch * cφ);
      var ra = base.pmod(new sexa.Time(st).rad() - g.lon - H, 2 * Math.PI);
      var dec = Math.asin(sφ * sh - cφ * ch * cA);
      return new Equatorial(ra, dec);
    }
  }]);

  return Horizontal;
}();

M.Horizontal = Horizontal;

/**
 * Galactic coordinates are referenced to the plane of the Milky Way.
 * @param {Number} lon - Longitude (l) in radians
 * @param {Number} lat - Latitude (b) in radians
 */

var Galactic = function () {
  function Galactic() {
    var lon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var lat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Galactic);

    this.lon = lon;
    this.lat = lat;
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


  _createClass(Galactic, [{
    key: 'toEquatorial',
    value: function toEquatorial() {
      // (-galactic0Lon1950 - math.Pi/2) = magic number of -123 deg
      var _base$sincos31 = base.sincos(this.lon - galactic0Lon1950 - Math.PI / 2),
          _base$sincos32 = _slicedToArray(_base$sincos31, 2),
          sdLon = _base$sincos32[0],
          cdLon = _base$sincos32[1];

      var _base$sincos33 = base.sincos(galacticNorth1950.dec),
          _base$sincos34 = _slicedToArray(_base$sincos33, 2),
          sgδ = _base$sincos34[0],
          cgδ = _base$sincos34[1];

      var _base$sincos35 = base.sincos(this.lat),
          _base$sincos36 = _slicedToArray(_base$sincos35, 2),
          sb = _base$sincos36[0],
          cb = _base$sincos36[1];

      var y = Math.atan2(sdLon, cdLon * sgδ - sb / cb * cgδ);
      // (galacticNorth1950.RA.Rad() - math.Pi) = magic number of 12.25 deg
      var ra = base.pmod(y + galacticNorth1950.ra - Math.PI, 2 * Math.PI);
      var dec = Math.asin(sb * sgδ + cb * cgδ * cdLon);
      return new Equatorial(ra, dec);
    }
  }]);

  return Galactic;
}();

M.Galactic = Galactic;

/**
* equatorial coords for galactic north
* IAU B1950.0 coordinates of galactic North Pole
*/
var galacticNorth1950 = M.galacticNorth1950 = M.galacticNorth = new Equatorial(new sexa.RA(12, 49, 0).rad(), 27.4 * Math.PI / 180);

/**
* Galactic Longitude 0°
* Meeus gives 33 as the origin of galactic longitudes relative to the
* ascending node of of the galactic equator.  33 + 90 = 123, the IAU
* value for origin relative to the equatorial pole.
*/
var galactic0Lon1950 = M.galactic0Lon1950 = M.galacticLon0 = 33 * Math.PI / 180;