import { describe, it, assert } from "vitest"
import Deferred from "./"

new Promise(function () {})

describe("deferred", () => {
  it("should resolve", async () => {
    const deferred = new Deferred()
    deferred.resolve("ok")
    assert.equal(await deferred, "ok")
  })

  it("should reject", async () => {
    const deferred = new Deferred()
    const err = new Error("oh noz")
    deferred.reject(err)
    try {
      await deferred
    } catch (e) {
      assert.equal(e, err)
    }
  })

  it("should then", () => {
    return new Promise<void>((resolve, reject) => {
      const deferred = new Deferred()
      const err = new Error("oh noz")
      deferred
        .then((e) => {
          assert.equal(e, err)
          resolve()
        })
        .catch(reject)
      deferred.resolve(err)
    })
  })

  it("should catch", () => {
    return new Promise<void>((resolve) => {
      const deferred = new Deferred()
      const err = new Error("oh noz")
      deferred.catch((e) => {
        assert.equal(e, err)
        resolve()
      })
      deferred.reject(err)
    })
  })

  it("should finally", () => {
    return new Promise<void>((resolve) => {
      const deferred = new Deferred()
      deferred.finally(() => {
        resolve()
      })
      deferred.resolve("ok")
    })
  })
})
