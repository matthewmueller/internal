const toString = {}.toString

export type Type =
  | "set"
  | "element"
  | "text-node"
  | "document"
  | "document-fragment"
  | "dom-node"
  | "function"
  | "date"
  | "regexp"
  | "arguments"
  | "array"
  | "string"
  | "null"
  | "undefined"
  | "number"
  | "boolean"
  | "object"
  | "map"
  | "bit-array"
  | "error"
  | "form-data"
  | "file"
  | "blob"
  | "bigint"
  | "symbol"

/**
 * Return the type of `val`.
 */

function type(x: any): Type {
  var type = typeof x
  if (type != "object") {
    return type
  }
  let otype = types[toString.call(x)]
  if (otype == "object") {
    // in case they have been polyfilled
    if (x instanceof Map) return "map"
    if (x instanceof Set) return "set"
    return "object"
  }
  if (otype) {
    return otype
  }
  if (x instanceof Node && "nodeType" in x) {
    switch (x.nodeType) {
      case 1:
        return "element"
      case 3:
        return "text-node"
      case 9:
        return "document"
      case 11:
        return "document-fragment"
      default:
        return "dom-node"
    }
  }
  throw new Error("internal/type: unhandled type: " + x)
}

export const types: { [k: string]: Type } = {
  "[object Function]": "function",
  "[object Date]": "date",
  "[object RegExp]": "regexp",
  "[object Arguments]": "arguments",
  "[object Array]": "array",
  "[object Set]": "set",
  "[object String]": "string",
  "[object Null]": "null",
  "[object Undefined]": "undefined",
  "[object Number]": "number",
  "[object Boolean]": "boolean",
  "[object Object]": "object",
  "[object Map]": "map",
  "[object Text]": "text-node",
  "[object Uint8Array]": "bit-array",
  "[object Uint16Array]": "bit-array",
  "[object Uint32Array]": "bit-array",
  "[object Uint8ClampedArray]": "bit-array",
  "[object Error]": "error",
  "[object FormData]": "form-data",
  "[object File]": "file",
  "[object Blob]": "blob",
}

export default type
