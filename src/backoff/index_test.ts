import { describe, it, assert } from "vitest"
import Backoff from "./"

describe(".duration()", function () {
  it("should increase the backoff", function () {
    var b = new Backoff()
    assert.equal(100, b.duration())
    assert.equal(200, b.duration())
    assert.equal(400, b.duration())
    assert.equal(800, b.duration())
    assert.equal(false, b.stop())

    b.reset()
    assert.equal(100, b.duration())
    assert.equal(200, b.duration())
    assert.equal(false, b.stop())

    b.reset()
    assert.equal(100, b.duration())
    assert.equal(200, b.duration())
    assert.equal(400, b.duration())
    assert.equal(800, b.duration())
    assert.equal(1600, b.duration())
    assert.equal(3200, b.duration())
    assert.equal(6400, b.duration())
    assert.equal(false, b.stop())
    assert.equal(10000, b.duration())
    assert.equal(true, b.stop())
  })
})
