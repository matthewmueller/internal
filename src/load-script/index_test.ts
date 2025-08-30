import { describe, it, assert, beforeAll, beforeEach, afterEach, afterAll } from "vitest"
import { http, HttpResponse } from "msw"
import { setupWorker } from "msw/browser"
import loadScript from "."

let lastLog = ""
// @ts-ignore log is triggered by the script
window.log = function (log: string) {
  lastLog = log
}

const worker = setupWorker(
  http.get("/async/script/hello.js", () => {
    return HttpResponse.text("window.log && window.log('Hello world')", {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
      },
    })
  }),
  http.get("/async/script/throw.js", () => {
    return HttpResponse.text("throw new Error('Error asyncing script')", {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
      },
    })
  }),
  http.get("*", () => {
    return HttpResponse.text("not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  })
)

describe("load-script", () => {
  beforeAll(() =>
    worker.start({
      quiet: true,
    })
  )
  beforeEach(() => {
    lastLog = ""
  })
  afterEach(() => worker.resetHandlers())
  afterAll(() => worker.stop())

  it("success", async function () {
    await loadScript(`/async/script/hello.js`)
    assert.equal(lastLog, "Hello world")
    const scripts = document.body.querySelectorAll("script")
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i]?.getAttribute("src") === "/async/script/hello.js") {
        return
      }
    }
    throw new Error("script not found")
  })

  it("async = false", async function () {
    const script = await loadScript("/async/script/hello.js", { async: "false" })
    assert.equal(script.async, false)
  })

  it("custom attribute", async function () {
    const script = await loadScript("/async/script/hello.js", { foo: "boo" })
    assert.equal(script.getAttribute("foo"), "boo")
  })

  it("custom type", async function () {
    const script = await loadScript("/async/script/hello.js", { type: "text/ecmascript" })
    assert.equal(script.type, "text/ecmascript")
  })

  it("nonexistent", async function () {
    try {
      await loadScript("/nonexistent.js")
    } catch (err: unknown) {
      if (!(err instanceof Error)) {
        throw new Error("err must be an error")
      }
      assert.include(err?.message, "Failed to load")
      assert.include(err?.message, "/nonexistent.js")
    }
  })

  // err is non-null only for network errors,
  // not for bad scripts that throw
  it("throw", async function () {
    try {
      await loadScript("/async/script/throws.js")
    } catch (err: unknown) {
      if (!(err instanceof Error)) {
        throw new Error("err must be an error")
      }
      assert.include(err?.message, "Failed to load")
      assert.include(err?.message, "/throws.js")
    }
  })
})
