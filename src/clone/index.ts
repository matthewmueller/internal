// @ts-nocheck
// TODO: typecheck

import type from '../internal/type'

/**
 * Clones objects.
 *
 * @param {Mixed} any object
 * @api public
 */

export default function clone<T>(obj: T): T {
  let copy: any = null

  switch (type(obj)) {
    case 'object':
      copy = {}
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          copy[key] = clone(obj[key])
        }
      }
      return copy

    case 'array':
      copy = new Array(obj.length)
      for (var i = 0, l = obj.length; i < l; i++) {
        copy[i] = clone(obj[i])
      }
      return copy

    case 'regexp':
      // from millermedeiros/amd-utils - MIT
      var flags = ''
      flags += obj.multiline ? 'm' : ''
      flags += obj.global ? 'g' : ''
      flags += obj.ignoreCase ? 'i' : ''
      return new RegExp(obj.source, flags)

    case 'date':
      return new Date(obj.getTime())

    default:
      // string, number, boolean, …
      return obj
  }
}
