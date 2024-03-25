var expect = require('expect.js')
var clone = require('../src/index').clone
var getUrlParam = require('../src/index').getUrlParam
var JSDOM = require('mocha-jsdom')
describe('单元测试', function () {
  describe('test hello', function () {
    it('hello', function () {
      expect(1).to.equal(1)
    })
  })
})

describe('function clone', function () {
  describe('param data', function () {
    it('正确的测试用例', function () {
      expect(clone('abc')).to.equal('abc')

      var arr = [1, [2]]
      var cloneArr = clone(arr)
      expect(cloneArr).not.to.equal(arr)
      expect(cloneArr).to.eql(arr)

      var obj = { a: { b: 1 } }
      var cloneObj = clone(obj)
      expect(cloneObj).not.to.equal(obj)
      expect(cloneObj).to.eql(obj)
    })
  })

  describe('边界值测试用例', function () {
    expect(clone()).to.equal(undefined)

    expect(clone(undefined)).to.equal(undefined)

    expect(clone(null)).to.equal(null)
  })
})

describe('获取当前 URL 中的参数', function () {
  JSDOM({ url: 'https://***.com/?a=1&b=2' })

  it('参数(id)的值', function () {
    expect(getUrlParam('a')).to.equal('1')
  })
})