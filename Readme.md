# Internal

Internal is a curated set of high-quality node modules. Internal aims to be the standard library node.js never had.

Each module in this repository has the following requirements

- Well-tested
- Small footprint
- Minimal API surface
- Works on both client and server (stubs are ok)
- Good documentation
- Provides type definitions

At it's best, this repository simply pulls in other modules. Occassionally there may be some freshly brewed code.

## Usage

```sh
yarn add internal
// or
yarn add internal-fetch
```

## Usage

```
import fetch from 'internal/fetch'
```

## What happened to the original `internal`?

The code for the original `internal` lives under the `1.x` versions. You can fix this by adjusting your dependencies in the following way:

```json
{
  "dependencies": {
    "internal": "1.x"
  }
}
```

I'm sorry in advance if I've caused any inconvenience with this transition.

## License

MIT
