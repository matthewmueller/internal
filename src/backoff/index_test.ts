import assert from '../assert'
import Backoff from './'

describe('.duration()', function() {
  it('should increase the backoff', function() {
    var b = new Backoff()
    assert(100 == b.duration())
    assert(200 == b.duration())
    assert(400 == b.duration())
    assert(800 == b.duration())
    assert(b.stop() == false)

    b.reset()
    assert(100 == b.duration())
    assert(200 == b.duration())
    assert(b.stop() == false)

    b.reset()
    assert(100 == b.duration())
    assert(200 == b.duration())
    assert(400 == b.duration())
    assert(800 == b.duration())
    assert(1600 == b.duration())
    assert(3200 == b.duration())
    assert(6400 == b.duration())
    assert(b.stop() == false)
    assert(10000 == b.duration())
    assert(b.stop() == true)
  })
})
