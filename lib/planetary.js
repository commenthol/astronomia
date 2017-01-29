'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module planetary
 */
/**
 * Planetary: Chapter 36, The Calculation of some Planetary Phenomena.
 *
 * Incomplete: Some functions unimplemented for lack of test data.
 */

var base = require('./base');

var M = exports;

/**
 * Mean computes some intermediate values for a mean planetary configuration
 * given a year and a row of coefficients from Table 36.A, p. 250.0
 */
var mean = M.mean = function (y, a) {
  // (y float64, a *ca)  (J, M, T float64)
  // (36.1) p. 250
  var k = Math.floor((365.2425 * y + 1721060 - a.A) / a.B + 0.5);
  var J = a.A + k * a.B;
  var M = base.pmod(a.M0 + k * a.M1, 360) * Math.PI / 180;
  var T = base.J2000Century(J);
  return [J, M, T];
};

/**
 * Sum computes a sum of periodic terms.
 */
var sum = M.sum = function (T, M, c) {
  // (T, M float64, c [][]float64)  float64
  var j = base.horner(T, c[0]);
  var mm = 0.0;
  for (var i = 1; i < c.length; i++) {
    mm += M;

    var _base$sincos = base.sincos(mm),
        _base$sincos2 = _slicedToArray(_base$sincos, 2),
        smm = _base$sincos2[0],
        cmm = _base$sincos2[1];

    j += smm * base.horner(T, c[i]);
    i++;
    j += cmm * base.horner(T, c[i]);
  }
  return j;
};

/**
 * ms returns a mean time corrected by a sum.
 */
var ms = M.ms = function (y, a, c) {
  // (y float64, a *ca, c [][]float64)  float64
  var _mean = mean(y, a),
      _mean2 = _slicedToArray(_mean, 3),
      J = _mean2[0],
      M = _mean2[1],
      T = _mean2[2];

  return J + sum(T, M, c);
};

/**
 * MercuryInfConj returns the time of an inferior conjunction of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.mercuryInfConj = function (y) {
  // (y float64)  (jde float64)
  return ms(y, micA, micB);
};

/**
 * MercurySupConj returns the time of a superior conjunction of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.mercurySupConj = function (y) {
  // (y float64)  (jde float64)
  return ms(y, mscA, mscB);
};

/**
 * VenusInfConj returns the time of an inferior conjunction of Venus.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.venusInfConj = function (y) {
  // (y float64)  (jde float64)
  return ms(y, vicA, vicB);
};

/**
 * MarsOpp returns the time of an opposition of Mars.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.marsOpp = function (y) {
  // (y float64)  (jde float64)
  return ms(y, moA, moB);
};

/**
 * SumA computes the sum of periodic terms with "additional angles"
 */
var sumA = M.sumA = function (T, M, c, aa) {
  // (T, M float64, c [][]float64, aa []caa)  float64
  var i = c.length - 2 * aa.length;
  var j = sum(T, M, c.slice(0, i));
  for (var k = 0; k < aa.length; k++) {
    var _base$sincos3 = base.sincos((aa[k].c + aa[k].f * T) * Math.PI / 180),
        _base$sincos4 = _slicedToArray(_base$sincos3, 2),
        _saa = _base$sincos4[0],
        caa = _base$sincos4[1];

    j += _saa * base.horner(T, c[i]);
    i++;
    j += caa * base.horner(T, c[i]);
    i++;
  }
  return j;
};

/**
 * Msa returns a mean time corrected by a sum.
 */
var msa = M.msa = function (y, a, c, aa) {
  // (y float64, a *ca, c [][]float64, aa []caa)  float64
  var _mean3 = mean(y, a),
      _mean4 = _slicedToArray(_mean3, 3),
      J = _mean4[0],
      M = _mean4[1],
      T = _mean4[2];

  return J + sumA(T, M, c, aa);
};

/**
 * JupiterOpp returns the time of an opposition of Jupiter.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.jupiterOpp = function (y) {
  // (y float64)  (jde float64)
  return msa(y, joA, joB, jaa);
};

/**
 * SaturnOpp returns the time of an opposition of Saturn.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.saturnOpp = function (y) {
  // (y float64)  (jde float64)
  return msa(y, soA, soB, saa);
};

/**
 * SaturnConj returns the time of a conjunction of Saturn.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.saturnConj = function (y) {
  // (y float64)  (jde float64)
  return msa(y, scA, scB, saa);
};

/**
 * UranusOpp returns the time of an opposition of Uranus.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.uranusOpp = function (y) {
  // (y float64)  (jde float64)
  return msa(y, uoA, uoB, uaa);
};

/**
 * NeptuneOpp returns the time of an opposition of Neptune.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.neptuneOpp = function (y) {
  // (y float64)  (jde float64)
  return msa(y, noA, noB, naa);
};

/**
 * El computes time and elongation of a greatest elongation event.
 */
var el = M.el = function (y, a, t, e) {
  // (y float64, a *ca, t, e [][]float64)  (jde, elongation float64)
  var _mean5 = mean(y, micA),
      _mean6 = _slicedToArray(_mean5, 3),
      J = _mean6[0],
      M = _mean6[1],
      T = _mean6[2];

  return [J + sum(T, M, t), sum(T, M, e) * Math.PI / 180];
};

/**
 * MercuryEastElongation returns the time and elongation of a greatest eastern elongation of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.mercuryEastElongation = function (y) {
  // (y float64)  (jde, elongation float64)
  return el(y, micA, met, mee);
};

/**
 * MercuryWestElongation returns the time and elongation of a greatest western elongation of Mercury.
 *
 * Result is time (as a jde) of the event nearest the given time (as a
 * decimal year.)
 */
M.mercuryWestElongation = function (y) {
  // (y float64)  (jde, elongation float64)
  return el(y, micA, mwt, mwe);
};

M.marsStation2 = function (y) {
  // (y float64)  (jde float64)
  var _mean7 = mean(y, moA),
      _mean8 = _slicedToArray(_mean7, 3),
      J = _mean8[0],
      M = _mean8[1],
      T = _mean8[2];

  return J + sum(T, M, ms2);
};

/**
 * ca holds coefficients from one line of table 36.A, p. 250
 */
function Ca(A, B, M0, M1) {
  this.A = A;
  this.B = B;
  this.M0 = M0;
  this.M1 = M1;
}

/**
 * Table 36.A, p. 250
 */
var micA = new Ca(2451612.023, 115.8774771, 63.5867, 114.2088742);
var mscA = new Ca(2451554.084, 115.8774771, 6.4822, 114.2088742);
var vicA = new Ca(2451996.706, 583.921361, 82.7311, 215.513058);
var moA = new Ca(2452097.382, 779.936104, 181.9573, 48.705244);
var joA = new Ca(2451870.628, 398.884046, 318.4681, 33.140229);
var soA = new Ca(2451870.17, 378.091904, 318.0172, 12.647487);
var scA = new Ca(2451681.124, 378.091904, 131.6934, 12.647487);
var uoA = new Ca(2451764.317, 369.656035, 213.6884, 4.333093);
var noA = new Ca(2451753.122, 367.486703, 202.6544, 2.194998);

/**
 * caa holds coefficients for "additional angles" for outer planets
 * as given on p. 251
 */
function Caa(c, f) {
  this.c = c;
  this.f = f;
}

var jaa = [new Caa(82.74, 40.76)];

var saa = [new Caa(82.74, 40.76), new Caa(29.86, 1181.36), new Caa(14.13, 590.68), new Caa(220.02, 1262.87)];

var uaa = [new Caa(207.83, 8.51), new Caa(108.84, 419.96)];

var naa = [new Caa(207.83, 8.51), new Caa(276.74, 209.98)];

/**
 * Table 33.B, p. 256
 */

/**
 * Mercury inferior conjunction
 */
var micB = [[0.0545, 0.0002], [-6.2008, 0.0074, 0.00003], [-3.275, -0.0197, 0.00001], [0.4737, -0.0052, -0.00001], [0.8111, 0.0033, -0.00002], [0.0037, 0.0018], [-0.1768, 0, 0.00001], [-0.0211, -0.0004], [0.0326, -0.0003], [0.0083, 0.0001], [-0.004, 0.0001]];

/**
 * Mercury superior conjunction
 */
var mscB = [[-0.0548, -0.0002], [7.3894, -0.01, -0.00003], [3.22, 0.0197, -0.00001], [0.8383, -0.0064, -0.00001], [0.9666, 0.0039, -0.00003], [0.077, -0.0026], [0.2758, 0.0002, -0.00002], [-0.0128, -0.0008], [0.0734, -0.0004, -0.00001], [-0.0122, -0.0002], [0.0173, -0.0002]];

/**
 * Venus inferior conjunction
 */
var vicB = [[-0.0096, 0.0002, -0.00001], [2.0009, -0.0033, -0.00001], [0.598, -0.0104, 0.00001], [0.0967, -0.0018, -0.00003], [0.0913, 0.0009, -0.00002], [0.0046, -0.0002], [0.0079, 0.0001]];

/**
 * Mars opposition
 */
var moB = [[-0.3088, 0, 0.00002], [-17.6965, 0.0363, 0.00005], [18.3131, 0.0467, -0.00006], [-0.2162, -0.0198, -0.00001], [-4.5028, -0.0019, 0.00007], [0.8987, 0.0058, -0.00002], [0.7666, -0.005, -0.00003], [-0.3636, -0.0001, 0.00002], [0.0402, 0.0032], [0.0737, -0.0008], [-0.098, -0.0011]];

/**
 * Jupiter opposition
 */
var joB = [[-0.1029, 0, -0.00009], [-1.9658, -0.0056, 0.00007], [6.1537, 0.021, -0.00006], [-0.2081, -0.0013], [-0.1116, -0.001], [0.0074, 0.0001], [-0.0097, -0.0001], [0, 0.0144, -0.00008], [0.3642, -0.0019, -0.00029]];

/**
 * Saturn opposition
 */
var soB = [[-0.0209, 0.0006, 0.00023], [4.5795, -0.0312, -0.00017], [1.1462, -0.0351, 0.00011], [0.0985, -0.0015], [0.0733, -0.0031, 0.00001], [0.0025, -0.0001], [0.005, -0.0002], [0, -0.0337, 0.00018], [-0.851, 0.0044, 0.00068], [0, -0.0064, 0.00004], [0.2397, -0.0012, -0.00008], [0, -0.001], [0.1245, 0.0006], [0, 0.0024, -0.00003], [0.0477, -0.0005, -0.00006]];

/**
 * Saturn conjunction
 */
var scB = [[0.0172, -0.0006, 0.00023], [-8.5885, 0.0411, 0.00020], [-1.147, 0.0352, -0.00011], [0.3331, -0.0034, -0.00001], [0.1145, -0.0045, 0.00002], [-0.0169, 0.0002], [-0.0109, 0.0004], [0, -0.0337, 0.00018], [-0.851, 0.0044, 0.00068], [0, -0.0064, 0.00004], [0.2397, -0.0012, -0.00008], [0, -0.001], [0.1245, 0.0006], [0, 0.0024, -0.00003], [0.0477, -0.0005, -0.00006]];

/**
 * Uranus opposition
 */
var uoB = [[0.0844, -0.0006], [-0.1048, 0.0246], [-5.1221, 0.0104, 0.00003], [-0.1428, 0.0005], [-0.0148, -0.0013], [0], [0.0055], [0], [0.885], [0], [0.2153]];

/**
 * Neptune opposition [
 */
var noB = [[-0.014, 0, 0.00001], [-1.3486, 0.001, 0.00001], [0.8597, 0.0037], [-0.0082, -0.0002, 0.00001], [0.0037, -0.0003], [0], [-0.5964], [0], [0.0728]];

/**
 * Table 36.C, p. 259
 */

/**
 * Mercury east time correction
 */
var met = [[-21.6106, 0.0002], [-1.9803, -0.006, 0.00001], [1.4151, -0.0072, -0.00001], [0.5528, -0.0005, -0.00001], [0.2905, 0.0034, 0.00001], [-0.1121, -0.0001, 0.00001], [-0.0098, -0.0015], [0.0192], [0.0111, 0.0004], [-0.0061], [-0.0032, -0.0001]];

/**
 * Mercury east elongation
 */
var mee = [[22.4697], [-4.2666, 0.0054, 0.00002], [-1.8537, -0.0137], [0.3598, 0.0008, -0.00001], [-0.068, 0.0026], [-0.0524, -0.0003], [0.0052, -0.0006], [0.0107, 0.0001], [-0.0013, 0.0001], [-0.0021], [0.0003]];

/**
 * Mercury west time correction
 */
var mwt = [[21.6249, -0.0002], [0.1306, 0.0065], [-2.7661, -0.0011, 0.00001], [0.2438, -0.0024, -0.00001], [0.5767, 0.0023], [0.1041], [-0.0184, 0.0007], [-0.0051, -0.0001], [0.0048, 0.0001], [0.0026], [0.0037]];

/**
 * Mercury west elongation
 */
var mwe = [[22.4143, -0.0001], [4.3651, -0.0048, -0.00002], [2.3787, 0.0121, -0.00001], [0.2674, 0.0022], [-0.3873, 0.0008, 0.00001], [-0.0369, -0.0001], [0.0017, -0.0001], [0.0059], [0.0061, 0.0001], [0.0007], [-0.0011]];

/**
 * Table 36.D, p. 261
 */

/**
 * Mars Station 2
 */
var ms2 = [[36.7191, 0.0016, 0.00003], [-12.6163, 0.0417, -0.00001], [20.1218, 0.0379, -0.00006], [-1.636, -0.019], [-3.9657, 0.0045, 0.00007], [1.1546, 0.0029, -0.00003], [0.2888, -0.0073, -0.00002], [-0.3128, 0.0017, 0.00002], [0.2513, 0.0026, -0.00002], [-0.0021, -0.0016], [-0.1497, -0.0006]];