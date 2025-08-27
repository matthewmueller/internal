/**
 * Cookie type
 */

type Cookies = {
  [cookie: string]: string
}

/**
 * Set options
 */

type Options = {
  maxage?: number
  expires?: Date
  domain?: string
  path?: string
  secure?: boolean
}

/**
 * Set cookie `name` to `value`.
 */

export function set(name: string, value: string | null, options?: Options): void {
  options = options || {}
  let str = encode(name) + "=" + encode(String(value))

  if (null == value) {
    options.maxage = -1
  }

  if (options.maxage) {
    options.expires = new Date(+new Date() + options.maxage)
  }

  if (options.path) str += "; path=" + options.path
  if (options.domain) str += "; domain=" + options.domain
  if (options.expires) str += "; expires=" + options.expires.toUTCString()
  if (options.secure) str += "; secure"

  document.cookie = str
}

/**
 * Return all cookies.
 *
 * This is isomorphic and may be called
 * from the server-side though it will
 * return nothing.
 */

export function all(): Cookies {
  var str
  try {
    str = document.cookie
  } catch (err) {
    return {}
  }
  return parse(str)
}

/**
 * Get cookie `name`.
 */

export function get(name: string): string | undefined {
  return all()[name]
}

/**
 * Parse cookie `str`.
 */

function parse(str: string): Cookies {
  if (!str) return {}
  const obj: Cookies = {}
  const pairs = str.split(/ *; */)
  for (const pair of pairs) {
    let eqidx = pair.indexOf("=")
    if (eqidx === -1) eqidx = pair.length
    const name = decode(pair.substring(0, eqidx))
    const value = decode(pair.substring(eqidx + 1))
    if (!name || value === undefined) continue
    obj[name] = value
  }
  return obj
}

/**
 * Encode.
 */

function encode(value: string): string | undefined {
  try {
    return encodeURIComponent(value)
  } catch {
    return undefined
  }
}

/**
 * Decode.
 */

function decode(value: string): string | undefined {
  try {
    return decodeURIComponent(value)
  } catch {
    return undefined
  }
}
