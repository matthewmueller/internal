/**
 * Imports
 */

import ensureError from "../ensure-error"

/**
 * Wrap a promise in another promise
 * that catches any rejects
 */

export default function maybe<T>(promise: Promise<T>): Promise<T | Error> {
  return new Promise(function (resolve) {
    promise
      .then(function (value) {
        return resolve(value)
      })
      .catch(function (err) {
        return resolve(ensureError(err))
      })
  })
}
