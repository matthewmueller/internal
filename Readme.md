# Internal

A curated set of high-quality, well-tested, minimal browser modules.

Each module has high test-coverage and is tested against Chrome, Firefox and Webkit.

## Install

```sh
npm install internal
```

## Usage

A few examples below but see [./src] for each module.

### maybe

Handle errors more gracefully.

```ts
import maybe from "internal/maybe"

const res = await maybe(fetch("http://mat.tm"))
if (res instanceof Error) {
  console.error(res)
  return
}
const text = await res.text()
```

### typeof

Gets the typeof a value at runtime.

```ts
import typeOf from "internal/typeof"
typeOf("hello") // "string"
typeOf(/asdf/) // "regexp"
```

### deferred

A promise you can pass around.

```ts
import Deferred from "internal/deferred"

const deferred = new Deferred()
doSomething(deferred)
const res = await deferred

function doSomething(deferred) {
  setTimeout(() => {
    deferred.resolve("ok")
  }, 1000)
}
```

### ensure-error

Ensures that whatever comes back is an Error.

```ts
import ensureError from "internal/ensure-error"
const err = ensureError("oh no")
err instanceof Error // true
```

## Development

```sh
git clone https://github.com/matthewmueller/internal

# Install node_modules and browser drivers
make install

# Run the test suite
make test

# Build to dist/
make build
```

## License

MIT
