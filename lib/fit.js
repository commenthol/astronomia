"use strict";

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module fit
 */
/**
 * Fit: Chapter 4, Curve Fitting.
 */
var M = exports;

/**
 * Linear fits a line to sample data.
 *
 * Argument p is a list of data points.  Results a and b are coefficients
 * of the best fit line y = ax + b.
 */
M.linear = function (points) {
  // (p []struct{ X, Y float64 })  (a, b float64)
  var sx = 0;
  var sy = 0;
  var sx2 = 0;
  var sxy = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var p = _step.value;

      var x = p.x;
      var y = p.y;
      sx += x;
      sy += y;
      sx2 += x * x;
      sxy += x * y;
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

  var n = points.length;
  var d = n * sx2 - sx * sx;
  // (4.2) p. 36
  var a = (n * sxy - sx * sy) / d;
  var b = (sy * sx2 - sx * sxy) / d;
  return [a, b];
};

/**
 * CorrelationCoefficient returns a correlation coefficient for sample data.
 */
M.correlationCoefficient = function (points) {
  // (p []struct{ X, Y float64 })  float64
  var sx = 0;
  var sy = 0;
  var sx2 = 0;
  var sy2 = 0;
  var sxy = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var p = _step2.value;

      var x = p.x;
      var y = p.y;
      sx += x;
      sy += y;
      sx2 += x * x;
      sy2 += y * y;
      sxy += x * y;
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

  var n = points.length;
  // (4.3) p. 38
  return (n * sxy - sx * sy) / (Math.sqrt(n * sx2 - sx * sx) * Math.sqrt(n * sy2 - sy * sy));
};

/**
 * Quadratic fits y = ax² + bx + c to sample data.
 *
 * Argument p is a list of data points.  Results a, b, and c are coefficients
 * of the best fit quadratic y = ax² + bx + c.
 */
M.quadratic = function (points) {
  var P = 0;
  var Q = 0;
  var R = 0;
  var S = 0;
  var T = 0;
  var U = 0;
  var V = 0;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = points[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var p = _step3.value;

      var x = p.x;
      var y = p.y;
      var x2 = x * x;
      P += x;
      Q += x2;
      R += x * x2;
      S += x2 * x2;
      T += y;
      U += x * y;
      V += x2 * y;
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

  var N = points.length;
  // (4.5) p. 43
  var D = N * Q * S + 2 * P * Q * R - Q * Q * Q - P * P * S - N * R * R;
  // (4.6) p. 43
  var a = (N * Q * V + P * R * T + P * Q * U - Q * Q * T - P * P * V - N * R * U) / D;
  var b = (N * S * U + P * Q * V + Q * R * T - Q * Q * U - P * S * T - N * R * V) / D;
  var c = (Q * S * T + Q * R * U + P * R * V - Q * Q * V - P * S * U - R * R * T) / D;
  return [a, b, c];
};

/**
 * Func3 implements multiple linear regression for a linear combination
 * of three functions.
 *
 * Given sample data and three functions in x, Func3 returns coefficients
 * a, b, and c fitting y = aƒ₀(x) + bƒ₁(x) + cƒ₂(x) to sample data.
 */
M.func3 = function (points, f0, f1, f2) {
  var M = 0;
  var P = 0;
  var Q = 0;
  var R = 0;
  var S = 0;
  var T = 0;
  var U = 0;
  var V = 0;
  var W = 0;
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = points[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var p = _step4.value;

      var x = p.x;
      var y = p.y;
      var y0 = f0(x);
      var y1 = f1(x);
      var y2 = f2(x);
      M += y0 * y0;
      P += y0 * y1;
      Q += y0 * y2;
      R += y1 * y1;
      S += y1 * y2;
      T += y2 * y2;
      U += y * y0;
      V += y * y1;
      W += y * y2;
    }
    // (4.7) p. 44
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

  var D = M * R * T + 2 * P * Q * S - M * S * S - R * Q * Q - T * P * P;
  var a = (U * (R * T - S * S) + V * (Q * S - P * T) + W * (P * S - Q * R)) / D;
  var b = (U * (S * Q - P * T) + V * (M * T - Q * Q) + W * (P * Q - M * S)) / D;
  var c = (U * (P * S - R * Q) + V * (P * Q - M * S) + W * (M * R - P * P)) / D;
  return [a, b, c];
};

/**
 * Func1 fits a linear multiple of a function to sample data.
 *
 * Given sample data and a function in x, Func1 returns coefficient
 * a fitting y = aƒ(x).
 */
M.func1 = function (points, f) {
  var syf = 0;
  var sf2 = 0;
  // (4.8) p. 45
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = points[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var p = _step5.value;

      var fx = f(p.x);
      var y = p.y;
      syf += y * fx;
      sf2 += fx * fx;
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  return syf / sf2;
};