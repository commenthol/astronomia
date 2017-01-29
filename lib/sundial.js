'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module sundial
 */
/**
 * Sundial: Chapter 58, Calculation of a Planar Sundial.
 */

var base = require('./base');

var M = module.exports;

/**
 * Point return type represents a point to be used in constructing the sundial.
 */
function Point(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

/**
 * Line holds data to draw an hour line on the sundial.
 */
function Line(hour, points) {
  this.hour = hour; // 0 to 24
  this.points = points || []; // One or more points corresponding to the hour.
}

var m = [-23.44, -20.15, -11.47, 0, 11.47, 20.15, 23.44];

/**
 * General computes data for the general case of a planar sundial.
 *
 * Argument φ is geographic latitude at which the sundial will be located.
 * D is gnomonic declination, the azimuth of the perpendicular to the plane
 * of the sundial, measured from the southern meridian towards the west.
 * Argument a is the length of a straight stylus perpendicular to the plane
 * of the sundial, z is zenithal distance of the direction defined by the
 * stylus.  Angles φ, D, and z are in radians.  Units of stylus length a
 * are arbitrary.
 *
 * Results consist of a set of lines, a center point, u, the length of a
 * polar stylus, and ψ, the angle which the polar stylus makes with the plane
 * of the sundial.  The center point, the points defining the hour lines, and
 * u are in units of a, the stylus length.  ψ is in radians.
 */
M.general = function (φ, D, a, z) {
  // (φ, D, a, z float64)  (lines []Line, center Point, u, ψ float64)
  var _base$sincos = base.sincos(φ),
      _base$sincos2 = _slicedToArray(_base$sincos, 2),
      sφ = _base$sincos2[0],
      cφ = _base$sincos2[1];

  var tφ = sφ / cφ;

  var _base$sincos3 = base.sincos(D),
      _base$sincos4 = _slicedToArray(_base$sincos3, 2),
      sD = _base$sincos4[0],
      cD = _base$sincos4[1];

  var _base$sincos5 = base.sincos(z),
      _base$sincos6 = _slicedToArray(_base$sincos5, 2),
      sz = _base$sincos6[0],
      cz = _base$sincos6[1];

  var P = sφ * cz - cφ * sz * cD;
  var lines = [];
  for (var i = 0; i < 24; i++) {
    var l = new Line(i);
    var H = (i - 12) * 15 * Math.PI / 180;
    var aH = Math.abs(H);

    var _base$sincos7 = base.sincos(H),
        _base$sincos8 = _slicedToArray(_base$sincos7, 2),
        sH = _base$sincos8[0],
        cH = _base$sincos8[1];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = m[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var d = _step.value;

        var tδ = Math.tan(d * Math.PI / 180);
        var H0 = Math.acos(-tφ * tδ);
        if (aH > H0) {
          continue; // sun below horizon
        }
        var Q = sD * sz * sH + (cφ * cz + sφ * sz * cD) * cH + P * tδ;
        if (Q < 0) {
          continue; // sun below plane of sundial
        }
        var Nx = cD * sH - sD * (sφ * cH - cφ * tδ);
        var Ny = cz * sD * sH - (cφ * sz - sφ * cz * cD) * cH - (sφ * sz + cφ * cz * cD) * tδ;
        l.points.push(new Point(a * Nx / Q, a * Ny / Q));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (l.points.length > 0) {
      lines.push(l);
    }
  }
  var center = new Point();
  center.x = a / P * cφ * sD;
  center.y = -a / P * (sφ * sz + cφ * cz * cD);
  var aP = Math.abs(P);
  var u = a / aP;
  var ψ = Math.asin(aP);
  return {
    lines: lines,
    center: center,
    length: u,
    angle: ψ
  };
};

/**
 * Equatorial computes data for a sundial level with the equator.
 *
 * Argument φ is geographic latitude at which the sundial will be located;
 * a is the length of a straight stylus perpendicular to the plane of the
 * sundial.
 *
 * The sundial will have two sides, north and south.  Results n and s define
 * lines on the north and south sides of the sundial.  Result coordinates
 * are in units of a, the stylus length.
 */
M.equatorial = function (φ, a) {
  // (φ, a float64)  (n, s []Line)
  var tφ = Math.tan(φ);
  var n = [];
  var s = [];
  for (var i = 0; i < 24; i++) {
    var nl = new Line(i);
    var sl = new Line(i);
    var H = (i - 12) * 15 * Math.PI / 180;
    var aH = Math.abs(H);

    var _base$sincos9 = base.sincos(H),
        _base$sincos10 = _slicedToArray(_base$sincos9, 2),
        sH = _base$sincos10[0],
        cH = _base$sincos10[1];

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = m[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var d = _step2.value;

        var tδ = Math.tan(d * Math.PI / 180);
        var H0 = Math.acos(-tφ * tδ);
        if (aH > H0) {
          continue;
        }
        var x = -a * sH / tδ;
        var yy = a * cH / tδ;
        if (tδ < 0) {
          sl.points.push(new Point(x, yy));
        } else {
          nl.points.push(new Point(x, -yy));
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    if (nl.points.length > 0) {
      n.push(nl);
    }
    if (sl.points.length > 0) {
      s.push(sl);
    }
  }
  return {
    north: n,
    south: s
  };
};

/**
 * Horizontal computes data for a horizontal sundial.
 *
 * Argument φ is geographic latitude at which the sundial will be located,
 * a is the length of a straight stylus perpendicular to the plane of the
 * sundial.
 *
 * Results consist of a set of lines, a center point, and u, the length of a
 * polar stylus.  They are in units of a, the stylus length.
 */
M.horizontal = function (φ, a) {
  // (φ, a float64)  (lines []Line, center Point, u float64)
  var _base$sincos11 = base.sincos(φ),
      _base$sincos12 = _slicedToArray(_base$sincos11, 2),
      sφ = _base$sincos12[0],
      cφ = _base$sincos12[1];

  var tφ = sφ / cφ;
  var lines = [];
  for (var i = 0; i < 24; i++) {
    var l = new Line(i);
    var H = (i - 12) * 15 * Math.PI / 180;
    var aH = Math.abs(H);

    var _base$sincos13 = base.sincos(H),
        _base$sincos14 = _slicedToArray(_base$sincos13, 2),
        sH = _base$sincos14[0],
        cH = _base$sincos14[1];

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = m[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var d = _step3.value;

        var tδ = Math.tan(d * Math.PI / 180);
        var H0 = Math.acos(-tφ * tδ);
        if (aH > H0) {
          continue; // sun below horizon
        }
        var Q = cφ * cH + sφ * tδ;
        var x = a * sH / Q;
        var y = a * (sφ * cH - cφ * tδ) / Q;
        l.points.push(new Point(x, y));
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    if (l.points.length > 0) {
      lines.push(l);
    }
  }
  var center = new Point(0, -a / tφ);
  var u = a / Math.abs(sφ);
  return {
    lines: lines,
    center: center,
    length: u
  };
};

/**
 * Vertical computes data for a vertical sundial.
 *
 * Argument φ is geographic latitude at which the sundial will be located.
 * D is gnomonic declination, the azimuth of the perpendicular to the plane
 * of the sundial, measured from the southern meridian towards the west.
 * Argument a is the length of a straight stylus perpendicular to the plane
 * of the sundial.
 *
 * Results consist of a set of lines, a center point, and u, the length of a
 * polar stylus.  They are in units of a, the stylus length.
 */
M.vertical = function (φ, D, a) {
  // (φ, D, a float64)  (lines []Line, center Point, u float64)
  var _base$sincos15 = base.sincos(φ),
      _base$sincos16 = _slicedToArray(_base$sincos15, 2),
      sφ = _base$sincos16[0],
      cφ = _base$sincos16[1];

  var tφ = sφ / cφ;

  var _base$sincos17 = base.sincos(D),
      _base$sincos18 = _slicedToArray(_base$sincos17, 2),
      sD = _base$sincos18[0],
      cD = _base$sincos18[1];

  var lines = [];
  for (var i = 0; i < 24; i++) {
    var l = new Line(i);
    var H = (i - 12) * 15 * Math.PI / 180;
    var aH = Math.abs(H);

    var _base$sincos19 = base.sincos(H),
        _base$sincos20 = _slicedToArray(_base$sincos19, 2),
        sH = _base$sincos20[0],
        cH = _base$sincos20[1];

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = m[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var d = _step4.value;

        var tδ = Math.tan(d * Math.PI / 180);
        var H0 = Math.acos(-tφ * tδ);
        if (aH > H0) {
          continue; // sun below horizon
        }
        var Q = sD * sH + sφ * cD * cH - cφ * cD * tδ;
        if (Q < 0) {
          continue; // sun below plane of sundial
        }
        var x = a * (cD * sH - sφ * sD * cH + cφ * sD * tδ) / Q;
        var y = -a * (cφ * cH + sφ * tδ) / Q;
        l.points.push(new Point(x, y));
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    if (l.points.length > 0) {
      lines.push(l);
    }
  }
  var center = new Point();
  center.x = -a * sD / cD;
  center.y = a * tφ / cD;
  var u = a / Math.abs(cφ * cD);
  return {
    lines: lines,
    center: center,
    length: u
  };
};