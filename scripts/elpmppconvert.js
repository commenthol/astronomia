/**
 * converts VSOP87 data to js
 */

'use strict'

const fs = require('fs')
const path = require('path')
const serialize = require('serialize-to-module')
const { ELPMPPDE405 } = require('../lib/elpmpp02')

const config = {
  attic: path.resolve(__dirname, '../attic'),
  dirname: path.resolve(__dirname, '../data')
}


main()

function main() {
  var v = new ELPMPPDE405(config.attic)
  v.loadSync()
  var o = v.getData()
  var data = serialize(o, {})
  fs.writeFileSync(filename('elpMppDeFull.js'), data, 'utf8')

  // truncate version
  o = v.getTruncateData({
    L: 0.001, // second
    B: 0.001, // second
    R: 0.01,  // meter
    T: 30,  // century
  })
  var data = serialize(o, {})
  fs.writeFileSync(filename('elpMppDe.js'), data, 'utf8')
}

function filename(name) {
  return path.resolve(config.dirname, name)
}
