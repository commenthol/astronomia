import assert from 'assert'
import {elementequinox} from '..'

describe('#elementequinox', function () {
  it('reduceB1950ToJ2000', function () {
    // Example 24.b, p. 161.
    var ele = new elementequinox.Elements(
      11.93911 * Math.PI / 180, // inc
      334.04096 * Math.PI / 180, // node
      186.24444 * Math.PI / 180 // peri
    )
    ele = elementequinox.reduceB1950ToJ2000(ele)
    assert.equal(ele.inc * 180 / Math.PI, 11.945236764689536) // 11.94524
    assert.equal(ele.node * 180 / Math.PI, 334.7500602425115) // 334.75006
    assert.equal(ele.peri * 180 / Math.PI, 186.23351531378918) // 186.23352
  })

  it('reduceB1950FK4ToJ2000FK5', function () {
    // Example 24.c, p. 162.
    var ele = new elementequinox.Elements(
      11.93911 * Math.PI / 180, // inc
      334.04096 * Math.PI / 180, // node
      186.24444 * Math.PI / 180 // peri
    )
    ele = elementequinox.reduceB1950FK4ToJ2000FK5(ele)
    assert.equal(ele.inc * 180 / Math.PI, 11.945206561406797) // 11.94521
    assert.equal(ele.node * 180 / Math.PI, 334.75042895869086) // 334.75043
    assert.equal(ele.peri * 180 / Math.PI, 186.23327459848562) // 186.23327
  })
})
