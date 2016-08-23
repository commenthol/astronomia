'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 */
/**
 * Moonposition: Chapter 47, Position of the Moon.
 */

var base = require('./base');

var M = exports;
var EARTH_RADIUS = 6378.137; // km

/**
 * parallax returns equatorial horizontal parallax of the Moon.
 *
 * @param {Number} distance - distance between centers of the Earth and Moon, in km.
 * @returns {Number} Result in radians.
 */
M.parallax = function (distance) {
  // p. 337
  return Math.asin(EARTH_RADIUS / distance);
};

var p = Math.PI / 180;

function dmf(T) {
  var d = base.horner(T, 297.8501921 * p, 445267.1114034 * p, -0.0018819 * p, p / 545868, -p / 113065000);
  var m = base.horner(T, 357.5291092 * p, 35999.0502909 * p, -0.0001535 * p, p / 24490000);
  var m_ = base.horner(T, 134.9633964 * p, 477198.8675055 * p, 0.0087414 * p, p / 69699, -p / 14712000);
  var f = base.horner(T, 93.272095 * p, 483202.0175233 * p, -0.0036539 * p, -p / 3526000, p / 863310000);
  return [d, m, m_, f];
}

/**
 * position returns geocentric location of the Moon.
 *
 * Results are referenced to mean equinox of date and do not include
 * the effect of nutation.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns {base.Coord}
 *  {number} lon - Geocentric longitude, in radians.
 *  {number} lat - Geocentric latitude, in radians.
 *  {number} range - Distance between centers of the Earth and Moon, in km.
 */
M.position = function (jde) {
  var T = base.J2000Century(jde);
  var l_ = base.horner(T, 218.3164477 * p, 481267.88123421 * p, -0.0015786 * p, p / 538841, -p / 65194000);

  var _dmf = dmf(T);

  var _dmf2 = _slicedToArray(_dmf, 4);

  var d = _dmf2[0];
  var m = _dmf2[1];
  var m_ = _dmf2[2];
  var f = _dmf2[3];

  var a1 = 119.75 * p + 131.849 * p * T;
  var a2 = 53.09 * p + 479264.29 * p * T;
  var a3 = 313.45 * p + 481266.484 * p * T;
  var e = base.horner(T, 1, -0.002516, -0.0000074);
  var e2 = e * e;
  var Σl = 3958 * Math.sin(a1) + 1962 * Math.sin(l_ - f) + 318 * Math.sin(a2);
  var Σr = 0.0;
  var Σb = -2235 * Math.sin(l_) + 382 * Math.sin(a3) + 175 * Math.sin(a1 - f) + 175 * Math.sin(a1 + f) + 127 * Math.sin(l_ - m_) - 115 * Math.sin(l_ + m_);
  ta.forEach(function (r) {
    var _base$sincos = base.sincos(d * r.d + m * r.m + m_ * r.m_ + f * r.f);

    var _base$sincos2 = _slicedToArray(_base$sincos, 2);

    var sa = _base$sincos2[0];
    var ca = _base$sincos2[1];

    switch (r.m) {
      case 0:
        Σl += r.Σl * sa;
        Σr += r.Σr * ca;
        break;
      case -1:
      case 1:
        Σl += r.Σl * sa * e;
        Σr += r.Σr * ca * e;
        break;
      case -2:
      case 2:
        Σl += r.Σl * sa * e2;
        Σr += r.Σr * ca * e2;
        break;
    }
  });

  tb.forEach(function (r) {
    var sb = Math.sin(d * r.d + m * r.m + m_ * r.m_ + f * r.f);
    switch (r.m) {
      case 0:
        Σb += r.Σb * sb;
        break;
      case -1:
      case 1:
        Σb += r.Σb * sb * e;
        break;
      case -2:
      case 2:
        Σb += r.Σb * sb * e2;
        break;
    }
  });
  var lon = base.pmod(l_, 2 * Math.PI) + Σl * 1e-6 * p;
  var lat = Σb * 1e-6 * p;
  var range = 385000.56 + Σr * 1e-3;
  return new base.Coord(lon, lat, range);
};

var ta = function () {
  var ta = [[0, 0, 1, 0, 6288774, -20905355], [2, 0, -1, 0, 1274027, -3699111], [2, 0, 0, 0, 658314, -2955968], [0, 0, 2, 0, 213618, -569925], [0, 1, 0, 0, -185116, 48888], [0, 0, 0, 2, -114332, -3149], [2, 0, -2, 0, 58793, 246158], [2, -1, -1, 0, 57066, -152138], [2, 0, 1, 0, 53322, -170733], [2, -1, 0, 0, 45758, -204586], [0, 1, -1, 0, -40923, -129620], [1, 0, 0, 0, -34720, 108743], [0, 1, 1, 0, -30383, 104755], [2, 0, 0, -2, 15327, 10321], [0, 0, 1, 2, -12528, 0], [0, 0, 1, -2, 10980, 79661], [4, 0, -1, 0, 10675, -34782], [0, 0, 3, 0, 10034, -23210], [4, 0, -2, 0, 8548, -21636], [2, 1, -1, 0, -7888, 24208], [2, 1, 0, 0, -6766, 30824], [1, 0, -1, 0, -5163, -8379], [1, 1, 0, 0, 4987, -16675], [2, -1, 1, 0, 4036, -12831], [2, 0, 2, 0, 3994, -10445], [4, 0, 0, 0, 3861, -11650], [2, 0, -3, 0, 3665, 14403], [0, 1, -2, 0, -2689, -7003], [2, 0, -1, 2, -2602, 0], [2, -1, -2, 0, 2390, 10056], [1, 0, 1, 0, -2348, 6322], [2, -2, 0, 0, 2236, -9884], [0, 1, 2, 0, -2120, 5751], [0, 2, 0, 0, -2069, 0], [2, -2, -1, 0, 2048, -4950], [2, 0, 1, -2, -1773, 4130], [2, 0, 0, 2, -1595, 0], [4, -1, -1, 0, 1215, -3958], [0, 0, 2, 2, -1110, 0], [3, 0, -1, 0, -892, 3258], [2, 1, 1, 0, -810, 2616], [4, -1, -2, 0, 759, -1897], [0, 2, -1, 0, -713, -2117], [2, 2, -1, 0, -700, 2354], [2, 1, -2, 0, 691, 0], [2, -1, 0, -2, 596, 0], [4, 0, 1, 0, 549, -1423], [0, 0, 4, 0, 537, -1117], [4, -1, 0, 0, 520, -1571], [1, 0, -2, 0, -487, -1739], [2, 1, 0, -2, -399, 0], [0, 0, 2, -2, -381, -4421], [1, 1, 1, 0, 351, 0], [3, 0, -2, 0, -340, 0], [4, 0, -3, 0, 330, 0], [2, -1, 2, 0, 327, 0], [0, 2, 1, 0, -323, 1165], [1, 1, -1, 0, 299, 0], [2, 0, 3, 0, 294, 0], [2, 0, -1, -2, 0, 8752]];
  return ta.map(function (row) {
    var o = {};['d', 'm', 'm_', 'f', 'Σl', 'Σr'].map(function (p, i) {
      o[p] = row[i];
    });
    return o;
  });
}();

var tb = function () {
  var tb = [[0, 0, 0, 1, 5128122], [0, 0, 1, 1, 280602], [0, 0, 1, -1, 277693], [2, 0, 0, -1, 173237], [2, 0, -1, 1, 55413], [2, 0, -1, -1, 46271], [2, 0, 0, 1, 32573], [0, 0, 2, 1, 17198], [2, 0, 1, -1, 9266], [0, 0, 2, -1, 8822], [2, -1, 0, -1, 8216], [2, 0, -2, -1, 4324], [2, 0, 1, 1, 4200], [2, 1, 0, -1, -3359], [2, -1, -1, 1, 2463], [2, -1, 0, 1, 2211], [2, -1, -1, -1, 2065], [0, 1, -1, -1, -1870], [4, 0, -1, -1, 1828], [0, 1, 0, 1, -1794], [0, 0, 0, 3, -1749], [0, 1, -1, 1, -1565], [1, 0, 0, 1, -1491], [0, 1, 1, 1, -1475], [0, 1, 1, -1, -1410], [0, 1, 0, -1, -1344], [1, 0, 0, -1, -1335], [0, 0, 3, 1, 1107], [4, 0, 0, -1, 1021], [4, 0, -1, 1, 833], [0, 0, 1, -3, 777], [4, 0, -2, 1, 671], [2, 0, 0, -3, 607], [2, 0, 2, -1, 596], [2, -1, 1, -1, 491], [2, 0, -2, 1, -451], [0, 0, 3, -1, 439], [2, 0, 2, 1, 422], [2, 0, -3, -1, 421], [2, 1, -1, 1, -366], [2, 1, 0, 1, -351], [4, 0, 0, 1, 331], [2, -1, 1, 1, 315], [2, -2, 0, -1, 302], [0, 0, 1, 3, -283], [2, 1, 1, -1, -229], [1, 1, 0, -1, 223], [1, 1, 0, 1, 223], [0, 1, -2, -1, -220], [2, 1, -1, -1, -220], [1, 0, 1, 1, -185], [2, -1, -2, -1, 181], [0, 1, 2, 1, -177], [4, 0, -2, -1, 176], [4, -1, -1, -1, 166], [1, 0, 1, -1, -164], [4, 0, 1, -1, 132], [1, 0, -1, -1, -119], [4, -1, 0, -1, 115], [2, -2, 0, 1, 107]];
  return tb.map(function (row) {
    var o = {};['d', 'm', 'm_', 'f', 'Σb'].map(function (p, i) {
      o[p] = row[i];
    });
    return o;
  });
}();

/**
 * Node returns longitude of the mean ascending node of the lunar orbit.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns result in radians.
 */
M.node = function (jde) {
  return base.pmod(base.horner(base.J2000Century(jde), 125.0445479 * p, -1934.1362891 * p, 0.0020754 * p, p / 467441, -p / 60616000), 2 * Math.PI);
};

/**
 * perigee returns longitude of perigee of the lunar orbit.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns result in radians.
 */
M.perigee = function (jde) {
  return base.pmod(base.horner(base.J2000Century(jde), 83.3532465 * p, 4069.0137287 * p, -0.01032 * p, -p / 80053, p / 18999000), 2 * Math.PI);
};

/**
 * trueNode returns longitude of the true ascending node.
 *
 * That is, the node of the instantaneous lunar orbit.
 *
 * @param {number} jde - Julian ephemeris day
 * @returns result in radians.
 */
M.trueNode = function (jde) {
  var _dmf3 = dmf(base.J2000Century(jde));

  var _dmf4 = _slicedToArray(_dmf3, 4);

  var d = _dmf4[0];
  var m = _dmf4[1];
  var m_ = _dmf4[2];
  var f = _dmf4[3];

  return M.node(jde) + -1.4979 * p * Math.sin(2 * (d - f)) + -0.15 * p * Math.sin(m) + -0.1226 * p * Math.sin(2 * d) + 0.1176 * p * Math.sin(2 * f) + -0.0801 * p * Math.sin(2 * (m_ - f));
};