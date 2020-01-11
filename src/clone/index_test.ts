/* test dependencies */

import assert from '../assert'
import clone from './'

/* tests */

describe('clone', function() {
  it('date', function() {
    var obj = new Date()
    var cloned = clone(obj)
    assert.deepEqual(cloned.getTime(), obj.getTime())
    assert.deepEqual(cloned, obj)
  })

  it('regexp', function() {
    var obj = /hello/i
    var cloned = clone(obj)
    assert.deepEqual(cloned.toString(), obj.toString())
    assert.deepEqual(cloned, obj)
  })

  it('array', function() {
    var obj = [1, 2, 3, '4']
    var cloned = clone(obj)
    assert.deepEqual(cloned, obj)
    assert(cloned != obj) // different reference
  })

  it('object', function() {
    var obj = {
      a: 1,
      b: 2,
      c: 3,
    }
    var cloned = clone(obj)
    assert.deepEqual(cloned, obj)
    assert(cloned != obj)
  })

  it('object combined', function() {
    var date = new Date()
    var obj = {
      a: {
        b: [1, 2, date, { hello: 'world' }],
      },
    }
    var cloned = clone(obj)
    assert.deepEqual(cloned, obj)
    assert(cloned.a != obj.a)
    assert(cloned.a.b != obj.a.b)
    assert(cloned.a.b[2] != obj.a.b[2])
    // @ts-ignore
    assert(cloned.a.b[2].getTime() == obj.a.b[2].getTime())
    assert.deepEqual(cloned.a.b[3], obj.a.b[3])
    assert(cloned.a.b[3] != obj.a.b[3])
  })

  it('object with functions', function() {
    var func = function() {
      return 'original'
    }
    var host = { fluent: func }
    var cloned = clone(host)

    // cloned function matches original

    assert(cloned.fluent == func)

    // change cloned function (no longer matches original)

    cloned.fluent = function() {
      return 'updated'
    }
    assert(cloned.fluent != func)
    assert(cloned.fluent() == 'updated')

    // original function is still in place

    assert(func() == 'original')
  })
})
