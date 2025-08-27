import typeOf from "."
import { describe, it, assert } from "vitest"

describe("typeOf", () => {
  it("should match objects", () => {
    class Foo {
      constructor() {}
    }
    assert.equal(typeOf({}), "object")
    assert.equal(typeOf(new Foo()), "object")
  })

  it("should match numbers", () => {
    assert.equal(typeOf(12), "number")
    assert.equal(typeOf(new Number(12)), "number")
  })

  it("should match strings", () => {
    assert.equal(typeOf("test"), "string")
    assert.equal(typeOf(new String("whoop")), "string")
  })

  it("should match dates", () => {
    assert.equal(typeOf(new Date()), "date")
  })

  it("should match booleans", () => {
    assert.equal(typeOf(true), "boolean")
    assert.equal(typeOf(false), "boolean")
    assert.equal(typeOf(new Boolean(false)), "boolean")
  })

  it("should match null", () => {
    assert.equal(typeOf(null), "null")
  })

  it("should match undefined", () => {
    assert.equal(typeOf(undefined), "undefined")
  })

  it("should match arrays", () => {
    assert.equal(typeOf([]), "array")
  })

  it("should match regexps", () => {
    assert.equal(typeOf(/asdf/), "regexp")
    assert.equal(typeOf(new RegExp("weee")), "regexp")
  })

  it("should match functions", () => {
    function A() {}
    assert.equal(
      typeOf(() => {}),
      "function"
    )
    assert.equal(typeOf(A), "function")
  })

  it("should match arguments", () => {
    assert.equal(
      typeOf(
        (function () {
          return arguments
        })()
      ),
      "arguments"
    )
  })

  it("should match typed arrays", () => {
    assert.equal(typeOf(new Uint8Array()), "bit-array")
    assert.equal(typeOf(new Uint16Array()), "bit-array")
    assert.equal(typeOf(new Uint32Array()), "bit-array")
  })

  it("should match errors", () => {
    assert.equal(typeOf(new Error()), "error")
    assert.equal(typeOf(new TypeError()), "error")
    assert.equal(typeOf(new RangeError()), "error")
    assert.equal(typeOf(new SyntaxError()), "error")
  })

  it("should match Maps", () => {
    assert.equal(typeOf(new Map()), "map")
  })

  it("should match Sets", () => {
    assert.equal(typeOf(new Set()), "set")
  })

  if (typeof window != "undefined")
    describe("in browsers", () => {
      it("should match elements", () => {
        assert.equal(typeOf(document.createElement("div")), "element")
      })

      it("should match textnodes", () => {
        assert.equal(typeOf(document.createTextNode("div")), "text-node")
      })

      if (typeof FormData == "function")
        it("should match from data", () => {
          assert.equal(typeOf(new FormData()), "form-data")
        })

      if (typeof File == "function")
        it("should match files", () => {
          assert.equal(typeOf(new File([], "")), "file") // TODO: fix test
        })

      if (typeof Blob == "function")
        it("should match blobs", () => {
          assert.equal(typeOf(new Blob()), "blob")
        })
    })
})
