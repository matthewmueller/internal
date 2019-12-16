# Internal

Internal is a curated set of high-quality node modules. Internal aims to be the standard library node.js never had.

Each module in this repository has the following requirements

- Well-tested
- Small footprint
- Minimal API surface
- Works on both client and server (stubs are ok)
- Good documentation
- Provides type definitions

At it's best, this repository simply pulls in other modules I've curated over the years. Occassionally there may be some freshly brewed code.

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

## License

MIT
