import eql from './'

function t(expr: boolean) {
  if (!expr) {
    throw new Error('expected true but got false')
  }
}

function f(expr: boolean) {
  if (expr) {
    throw new Error('expected false but got true')
  }
}

describe('equals', () => {
  describe('Object strucures', () => {
    it('when structures match', () => {
      t(eql({ a: [2, 3], b: [4] }, { a: [2, 3], b: [4] }))
    })

    it("when structures don't match", () => {
      f(eql({ x: 5, y: [6] }, { x: 5, y: 6 }))
    })

    it('should handle nested nulls', () => {
      t(eql([null, null, null], [null, null, null]))
      f(eql([null, null, null], [null, 'null', null]))
    })

    it('should handle nested NaNs', () => {
      t(eql([NaN, NaN, NaN], [NaN, NaN, NaN]))
      f(eql([NaN, NaN, NaN], [NaN, 'NaN', NaN]))
    })

    it('custom equal methods', function() {
      t(
        eql(
          {
            equal: function() {
              return true
            },
          },
          {}
        )
      )
      f(
        eql(
          {
            equal: function() {
              return false
            },
          },
          {}
        )
      )
    })
  })

  describe('Comparing arguments', () => {
    var a = (function a(_a, _b, _c) {
      return arguments
    })(1, 2, 3)
    var b = (function b(_a, _b, _c) {
      return arguments
    })(1, 2, 3)
    var c = (function c(_a, _b, _c) {
      return arguments
    })(2, 2, 3)

    it('should not consider the callee', () => {
      t(eql(a, b))
      f(eql(a, c))
    })

    it('should be comparable to an Array', () => {
      t(eql(a, [1, 2, 3]))
      f(eql(a, [1, 2, 4]))
      f(eql(a, [1, 2]))
    })

    // it('should be comparable to an Object', () => {
    //   t(eql(a, { 0: 1, 1: 2, 2: 3, length: 3 }))
    //   f(eql(a, { 0: 1, 1: 2, 2: 3, length: 4 }))
    //   f(eql(a, { 0: 1, 1: 2, 2: 4, length: 3 }))
    //   f(eql(a, { 0: 1, 1: 2, length: 2 }))
    // }).skip()
  })

  describe('Numbers', () => {
    it('should not coerce strings', () => {
      f(eql('1', 1))
    })
    it('-0 should equal +0', () => {
      t(eql(-0, +0))
    })
    describe('NaN', () => {
      it('should equal Nan', () => {
        t(eql(NaN, NaN))
      })
      it('NaN should not equal undefined', () => {
        f(eql(NaN, undefined))
      })
      it('NaN should not equal null', () => {
        f(eql(NaN, null))
      })
      it('NaN should not equal empty string', () => {
        f(eql(NaN, ''))
      })
      it('should not equal zero', () => {
        f(eql(NaN, 0))
      })
    })
  })

  describe('Strings', () => {
    it('should be case sensitive', () => {
      f(eql('hi', 'Hi'))
      t(eql('hi', 'hi'))
    })

    it('empty string should equal empty string', () => {
      t(eql('', ''))
    })
  })

  describe('undefined', () => {
    it('should equal only itself', () => {
      f(eql(undefined, null))
      f(eql(undefined, ''))
      f(eql(undefined, 0))
      f(eql(undefined, []))
      t(eql(undefined, undefined))
      f(eql(undefined, NaN))
    })
  })

  describe('null', () => {
    it('should equal only itself', () => {
      f(eql(null, undefined))
      f(eql(null, ''))
      f(eql(null, 0))
      f(eql(null, []))
      t(eql(null, null))
      f(eql(null, NaN))
    })
  })

  describe('Cyclic structures', () => {
    it('should not go into an infinite loop', () => {
      var a = { self: {} }
      var b = { self: {} }
      a.self = a
      b.self = b
      t(eql(a, b))
    })
  })

  describe('functions', () => {
    it('should fail if they have different names', () => {
      f(
        eql(
          function a() {},
          function b() {}
        )
      )
    })

    it('should pass if they are both anonamous', () => {
      t(
        eql(
          () => {},
          () => {}
        )
      )
    })

    // it('handle the case where they have different argument names', () => {
    //   t(
    //     eql(
    //       function(b: any) {
    //         return b
    //       },
    //       function(a: any) {
    //         return a
    //       }
    //     )
    //   )
    // }).skip()

    it('should compare them as objects', () => {
      var a = () => {}
      var b = () => {}
      // @ts-ignore
      a.title = 'sometitle'
      f(eql(a, b))
    })

    it('should compare their prototypes', () => {
      var a = function() {}
      var b = function() {}
      a.prototype.a = 1
      f(eql(a, b))
    })

    it('should be able to compare object methods', () => {
      t(eql({ noop: () => {} }, { noop: () => {} }))
      f(eql({ noop: function() {} }, { noop: () => {} }))
    })
  })

  if (typeof Buffer !== 'undefined') {
    describe('Buffer', () => {
      it('should compare on content', () => {
        t(eql(new Buffer('abc'), new Buffer('abc')))
        f(eql(new Buffer('a'), new Buffer('b')))
        f(eql(new Buffer('a'), new Buffer('ab')))
      })

      it('should fail against anything other than a buffer', () => {
        t(eql(new Buffer('abc'), [97, 98, 99]))
        f(eql(new Buffer('abc'), { 0: 97, 1: 98, 2: 99, length: 3 }))
        t(eql([97, 98, 99], new Buffer('abc')))
        f(eql({ 0: 97, 1: 98, 2: 99, length: 3 }, new Buffer('abc')))
      })
    })
  }

  describe('possible regressions', () => {
    it('should handle objects with no constructor property', () => {
      var a = Object.create(null)
      t(eql(a, {}))
      t(eql({}, a))
      f(eql(a, { a: 1 }))
      f(eql({ a: 1 }, a))
    })

    it('when comparing primitives to composites', () => {
      f(eql({}, undefined))
      f(eql(undefined, {}))

      f(eql(new String(), {}))
      f(eql({}, new String()))

      f(eql({}, new Number()))
      f(eql(new Number(), {}))

      f(eql(new Boolean(), {}))
      f(eql({}, new Boolean()))

      f(eql(new Date(), {}))
      f(eql({}, new Date()))

      f(eql(new RegExp(''), {}))
      f(eql({}, new RegExp('')))
    })
  })
})
