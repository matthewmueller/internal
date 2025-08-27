import typeOf from "../typeof"

/**
 * Clones objects.
 */
export default function clone<T>(obj: T): T {
  let copy: any = null

  switch (typeOf(obj)) {
    case "object":
      copy = {}
      for (var key in obj as any) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          copy[key] = clone((obj as any)[key])
        }
      }
      return copy as T

    case "array":
      copy = new Array((obj as any).length)
      for (var i = 0, l = (obj as any).length; i < l; i++) {
        copy[i] = clone((obj as any)[i])
      }
      return copy as T

    case "regexp":
      // from millermedeiros/amd-utils - MIT
      var flags = ""
      flags += (obj as any).multiline ? "m" : ""
      flags += (obj as any).global ? "g" : ""
      flags += (obj as any).ignoreCase ? "i" : ""
      return new RegExp((obj as RegExp).source, flags) as T

    case "date":
      return new Date((obj as Date).getTime()) as T

    default:
      // string, number, boolean, …
      return obj as T
  }
}
