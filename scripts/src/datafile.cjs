const fs = require('fs')

const splitRows = (rows, breaks) => {
  const _rows = rows.map(line => {
    const arr = []
    for (let i = 0; i < breaks.length; i++) {
      const [start, end] = breaks[i]
      arr.push(line.substring(start, end).trim())
    }
    return arr
  })
  return _rows
}

/**
 * split data into array of arrays
 * @param {String} filename
 * @param {Number[]} breaks - breakpoints with position of column start
 * @returns {String[][]}
 */
const datafile = (filename, breaks) => {
  const content = fs.readFileSync(filename, 'utf8')
  const data = splitRows(content.split(/[\n\r]/), breaks)
  return data
}

exports.datafile = datafile

// const r = datafile(`${__dirname}/../../attic/deltat.preds`, [[3,14], [14,22], [22,34], [34,48]])
// console.log(r)
