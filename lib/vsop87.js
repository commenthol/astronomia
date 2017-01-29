'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2016 commenthol
 * @license MIT
 * @module vsop87
 */
/**
 * Converts VSOP87 data files to javascript modules
 */

var fs = require('fs');
var path = require('path');

var REGVSOP = /^\sVSOP87.*VARIABLE (\d) \((LBR|XYZ)\).*\*T\*\*(\d)\s+(\d+) TERMS/;

// planet names in VSOP87 files
var planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

// VSOP planet extension names
var exts = ['mer', 'ven', 'ear', 'mar', 'jup', 'sat', 'ura', 'nep'];

var toFloat = function toFloat(f) {
  return parseFloat(f, 10);
};

var VSOP = function () {
  /**
   * load VSOP87 planet data from VSOP87 files
   * Data can be obtained from ftp://cdsarc.u-strasbg.fr/pub/cats/VI%2F81/
   * @throws {Error}
   * @param {String} planet - MERCURY VENUS EARTH MARS JUPITER SATURN URANUS NEPTUNE
   * @param {String} dirname - folder containing VSOP87 files
   * @param {Object} [opts]
   * @param {String} [opts.type] - file type A, B, C, D - See vsop87.txt
   */
  function VSOP(planet, dirname, opts) {
    _classCallCheck(this, VSOP);

    planet = planet.toLowerCase();
    if (~planets.indexOf(planet)) {
      opts = opts || {};
      this.planet = planet;
      this.dirname = dirname;
      this.type = opts.type || 'B'; // HELIOCENTRIC DYNAMICAL ECLIPTIC AND EQUINOX J2000
    } else {
      throw new Error('Invalid planet ' + planet);
    }
  }

  /** get file extension for planet */


  _createClass(VSOP, [{
    key: '_getExt',
    value: function _getExt() {
      return exts[planets.indexOf(this.planet)];
    }

    /** load data from file */

  }, {
    key: 'load',
    value: function load(cb) {
      var _this = this;

      var ext = this._getExt();
      var filename = path.resolve(this.dirname, 'VSOP87' + this.type + '.' + ext);
      fs.readFile(filename, 'utf8', function (err, data) {
        if (!err) {
          _this.parse(data);
        }
        cb(err);
      });
    }

    /** sync loading */

  }, {
    key: 'loadSync',
    value: function loadSync() {
      var ext = this._getExt();
      var filename = path.resolve(this.dirname, 'VSOP87' + this.type + '.' + ext);
      var data = fs.readFileSync(filename, 'utf8');
      this.parse(data);
    }

    /**
     * parse data
     * @param {String} data - content of VSOP file
     */

  }, {
    key: 'parse',
    value: function parse(data) {
      var _this2 = this;

      this.data = {};
      var lines = data.split(/\n/);
      var varName;
      var ref;

      lines.forEach(function (line) {
        if (REGVSOP.test(line)) {
          var _line$match = line.match(REGVSOP),
              _line$match2 = _slicedToArray(_line$match, 4),
              varCnt = _line$match2[1],
              type = _line$match2[2],
              pos = _line$match2[3];

          varName = type.split('')[varCnt - 1];
          if (!_this2.data[varName]) _this2.data[varName] = {};
          ref = _this2.data[varName][pos] = [];
        } else {
          if (line.length > 79) {
            ref.push([toFloat(line.substr(79, 97).trim()), toFloat(line.substr(98, 111).trim()), toFloat(line.substr(111, 131).trim())]);
          }
        }
      });
    }

    /**
     * get parsed data
     * @return {Object}
     * ```js
     * { L: { '0': [[<A>, <B>, <C>], ...], '1': [], '2': [], '3': [], '4': [], '5': [] },
     *   B: { '0': [], '1': [], '2': [], '3': [], '4': [], '5': [] },
     *   R: { '0': [], '1': [], '2': [], '3': [], '4': [], '5': [] } }
     * ```
     */

  }, {
    key: 'getData',
    value: function getData() {
      return this.data;
    }
  }]);

  return VSOP;
}();

module.exports = VSOP;