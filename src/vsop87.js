/**
 * @copyright 2016 commenthol
 * @license MIT
 * @module vsop87
 */
/**
 * Converts VSOP87 data files to javascript modules
 */

import fs from 'fs'
import path from 'path'

const REGVSOP =
  /^\sVSOP87.*VARIABLE (\d) \((LBR|XYZ)\).{1,20}\*T\*\*(\d)\s{1,20}(\d{1,20}) TERMS/

// planet names in VSOP87 files
const planets = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune'
]

// VSOP planet extension names
const exts = ['mer', 'ven', 'ear', 'mar', 'jup', 'sat', 'ura', 'nep']

const toFloat = function (f) {
  return parseFloat(f)
}

export class VSOP {
  /**
   * load VSOP87 planet data from VSOP87 files
   * Data can be obtained from ftp://cdsarc.u-strasbg.fr/pub/cats/VI%2F81/
   * @throws {Error}
   * @param {String} planet - MERCURY VENUS EARTH MARS JUPITER SATURN URANUS NEPTUNE
   * @param {String} dirname - folder containing VSOP87 files
   * @param {Object} [opts]
   * @param {String} [opts.type] - file type A, B, C, D - See vsop87.txt
   */
  constructor(planet, dirname, opts) {
    planet = planet.toLowerCase()
    if (~planets.indexOf(planet)) {
      opts = opts || {}
      this.planet = planet
      this.dirname = dirname
      this.type = opts.type || 'B' // HELIOCENTRIC DYNAMICAL ECLIPTIC AND EQUINOX J2000
    } else {
      throw new Error('Invalid planet ' + planet)
    }
  }

  /** @returns {string} File extension for the configured planet. */
  _getExt() {
    return exts[planets.indexOf(this.planet)]
  }

  /**
   * Load and parse the configured VSOP87 data file.
   * @param {(error: Error|null) => void} cb - Completion callback.
   * @returns {void}
   */
  load(cb) {
    const ext = this._getExt()
    const filename = path.resolve(
      this.dirname,
      'VSOP87' + this.type + '.' + ext
    )
    fs.readFile(filename, 'utf8', (err, data) => {
      if (!err) {
        this.parse(data)
      }
      cb(err)
    })
  }

  /**
   * Load and parse the configured VSOP87 data file synchronously.
   * @returns {void}
   */
  loadSync() {
    const ext = this._getExt()
    const filename = path.resolve(
      this.dirname,
      'VSOP87' + this.type + '.' + ext
    )
    const data = fs.readFileSync(filename, 'utf8')
    this.parse(data)
  }

  /**
   * parse data
   * @param {string} data - Content of the VSOP file.
   * @returns {void}
   */
  parse(data) {
    this.data = {}
    const lines = data.split(/\n/)
    let varName
    let ref

    lines.forEach((line) => {
      if (REGVSOP.test(line)) {
        const [, varCnt, type, pos] = line.match(REGVSOP)
        varName = type.split('')[Number(varCnt) - 1]
        if (!this.data[varName]) this.data[varName] = {}
        ref = this.data[varName][pos] = []
      } else {
        if (line.length > 79) {
          ref.push([
            toFloat(line.substr(79, 97).trim()),
            toFloat(line.substr(98, 111).trim()),
            toFloat(line.substr(111, 131).trim())
          ])
        }
      }
    })
  }

  /**
   * get parsed data
   * ```js
   * { L: { '0': [[<A>, <B>, <C>], ...], '1': [], '2': [], '3': [], '4': [], '5': [] },
   *   B: { '0': [], '1': [], '2': [], '3': [], '4': [], '5': [] },
   *   R: { '0': [], '1': [], '2': [], '3': [], '4': [], '5': [] } }
   * ```
   * @returns {Record<string, Record<string, number[][]>>} Parsed VSOP87 coefficients.
   */
  getData() {
    return this.data
  }
}

export default {
  VSOP
}
