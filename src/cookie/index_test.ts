import { describe, it, assert, beforeEach } from "vitest"
import * as cookie from "./"

describe("cookie", () => {
  beforeEach(() => {
    // clear out the cookies before each run
    for (let key in cookie.all()) {
      cookie.set(key, null)
    }
  })

  describe("cookie.set(name, value)", function () {
    it("should set a cookie", function () {
      cookie.set("name", "tobi")
      assert.equal("tobi", cookie.get("name"))

      cookie.set("species", "ferret")
      assert.equal("ferret", cookie.get("species"))
    })

    it("should escape", function () {
      cookie.set("name", "tobi ferret")
      assert.equal(true, !!~document.cookie.indexOf("name=tobi%20ferret"))
    })

    it("should unescape", function () {
      cookie.set("full name", "tobi ferret")
      assert.equal("tobi ferret", cookie.get("full name"))
    })

    it("should ignore URIError", function () {
      cookie.set("bad", "%")
      cookie.set("bad", null)
    })

    describe("when undefined", function () {
      it("should return undefined", function () {
        assert.equal(undefined, cookie.get("whatever"))
      })
    })
  })

  describe("cookie.set(name, null)", function () {
    it("should clear the cookie", function () {
      cookie.set("type", "ferret")
      cookie.set("type", null)
      assert.equal(undefined, cookie.get("type"))
    })

    it("should not be returned in the cookie() object", function () {
      cookie.set("full name", null)
      cookie.set("mydb", null)
      cookie.set("species", null)
      cookie.set("name", "0")
      var obj = cookie.all()
      assert.equal(1, Object.keys(obj).length)
      assert.equal("0", obj["name"])
    })

    it("should ignore URIError and return null", function () {
      document.cookie = "bad=%"
      assert.equal(undefined, cookie.get("bad"))
    })
  })

  describe("cookie.all()", function () {
    it("should return all cookies", function () {
      cookie.set("name", "loki")
      cookie.set("species", "ferret")
      var obj = cookie.all()
      assert.equal(true, !!obj)
      assert.equal("loki", obj["name"])
      assert.equal("ferret", obj["species"])
    })

    it("should return all cookies and ignore URIErrors", function () {
      cookie.set("name", "loki")
      cookie.set("species", "ferret")
      document.cookie = "bad=%"
      var obj = cookie.all()
      assert.equal("loki", obj["name"])
      assert.equal("ferret", obj["species"])
      assert.equal(undefined, obj["bad"])
    })

    it("should properly handle equal signs in the value", function () {
      // see https://github.com/matthewmueller/next-cookies/issues/20
      var values = ["=", "==", "===", "a=b", "a==b", "a=", "SEnxqTgooNWEFfQ9gUipwdhUrZm1VejMLDQ=="]
      values.forEach(function (value) {
        document.cookie = "name=" + value
        assert.equal(value, cookie.get("name"))
      })
    })
  })
})
