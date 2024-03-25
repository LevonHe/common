var expect = require('expect.js')
var type = require('../src/index.js').type

describe('c', function () {
  this.timeout(1000)
  it('单元测试', function () {
    expect(type(undefined)).to.be('undefined')
    expect(type(null)).to.be('null')
    expect(type(true)).to.be('boolean')
    expect(type(1)).to.be('number')
    expect(type('')).to.be('string')
    expect(type(Symbol())).to.be('symbol')

    expect(type({})).to.be('Object')
    expect(type([])).to.be('Array')
    expect(type(WeakMap)).to.be('function')
  })
})