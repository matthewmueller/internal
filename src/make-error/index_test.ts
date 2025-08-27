import { describe, it, assert } from "vitest"
import ensure from "."

describe("make-error", () => {
  it("should ignore real errors", () => {
    const err = new Error("oh noz")
    assert.equal(err, ensure(err))
  })

  it("should ignore extended errors", () => {
    class CustomError extends Error {
      constructor(message: string) {
        super("custom message: " + message)
      }
    }
    const custom = new CustomError("something")
    assert.equal(custom, ensure(custom))
  })

  it("should ignore typeerrors", () => {
    const err = new TypeError("oh noz")
    assert.equal(err, ensure(err))
  })

  it("should turn a string into an error", () => {
    const err = "string"
    assert.notEqual<string | Error>(err, ensure(err))
    assert.equal(err, ensure(err).message)
    assert.equal("NonError", ensure(err).name)
    assert.notEqual("", ensure(err).stack)
  })

  it("should turn undefined into an error", () => {
    const err = undefined
    assert.notEqual(err, ensure(err))
    assert.equal("<No error message>", ensure(err).message)
    assert.equal("NonError", ensure(err).name)
    assert.notEqual("", ensure(err).stack)
  })

  it("should turn null into an error", () => {
    const err = null
    assert.notEqual(err, ensure(err))
    assert.equal("<No error message>", ensure(err).message)
    assert.equal("NonError", ensure(err).name)
    assert.notEqual("", ensure(err).stack)
  })

  it("should add a name if there isn't one", () => {
    const err = new Error("oh noz")
    err.name = ""
    assert.equal(ensure(err).name, "Error")
  })
})
