/**
 * Module dependencies.
 */

import equals from '../internal/equals'
import fmt from '../internal/fmt'

/**
 * Export `assert`
 */

export default assert

/**
 * Assert `expr` with optional failure `msg`.
 *
 * @param {Mixed} expr
 * @param {String} [msg]
 * @api public
 */

function assert(expr: unknown, msg?: string): void {
  if (expr) return
  throw error(msg || message() || 'assertion failed')
}

/**
 * Ok is a simple alias
 */

assert.ok = assert

/**
 * Assert `actual` is weak equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

assert.equal = function(actual: unknown, expected: unknown, msg?: string) {
  if (actual == expected) return
  throw error(
    msg || fmt('Expected %o to equal %o.', actual, expected),
    actual,
    expected
  )
}

/**
 * Assert `actual` is not weak equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

assert.notEqual = function(actual: unknown, expected: unknown, msg?: string) {
  if (actual != expected) return
  throw error(msg || fmt('Expected %o not to equal %o.', actual, expected))
}

/**
 * Assert `actual` is deep equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

assert.deepEqual = function(actual: unknown, expected: unknown, msg?: string) {
  if (equals(actual, expected)) return
  throw error(
    msg || fmt('Expected %o to deeply equal %o.', actual, expected),
    actual,
    expected
  )
}

/**
 * Assert `actual` is not deep equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

assert.notDeepEqual = function(
  actual: unknown,
  expected: unknown,
  msg?: string
) {
  if (!equals(actual, expected)) return
  throw error(
    msg || fmt('Expected %o not to deeply equal %o.', actual, expected)
  )
}

/**
 * Assert `actual` is strict equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

assert.strictEqual = function(
  actual: unknown,
  expected: unknown,
  msg?: string
) {
  if (actual === expected) return
  throw error(
    msg || fmt('Expected %o to strictly equal %o.', actual, expected),
    actual,
    expected
  )
}

/**
 * Assert `actual` is not strict equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

assert.notStrictEqual = function(
  actual: unknown,
  expected: unknown,
  msg?: string
) {
  if (actual !== expected) return
  throw error(
    msg || fmt('Expected %o not to strictly equal %o.', actual, expected)
  )
}

/**
 * Assert `block` throws an `error`.
 *
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [msg]
 * @api public
 */

assert.throws = function(block: () => void, err?: Function, msg?: string) {
  var threw
  try {
    block()
  } catch (e) {
    threw = e
  }
  if (!threw)
    throw error(msg || fmt('Expected %s to throw an error.', block.toString()))
  if (err && !(threw instanceof err)) {
    throw error(
      msg || fmt('Expected %s to throw an %o.', block.toString(), err)
    )
  }
}

/**
 * Assert `block` doesn't throw an `error`.
 *
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [msg]
 * @api public
 */

assert.doesNotThrow = function(
  block: () => void,
  err?: Function,
  msg?: string
) {
  var threw
  try {
    block()
  } catch (e) {
    threw = e
  }
  if (threw)
    throw error(
      msg || fmt('Expected %s not to throw an error.', block.toString())
    )
  if (err && threw instanceof err) {
    throw error(
      msg || fmt('Expected %s not to throw an %o.', block.toString(), err)
    )
  }
}

/**
 * Create a message from the call stack.
 *
 * @return {String}
 * @api private
 */

function message(): string | null {
  if (!Error.captureStackTrace) {
    return 'assertion failed'
  }
  var callsite = stack()[3]
  var file = callsite.getFileName()
  var lineno = (callsite.getLineNumber() || 0) - 1
  var col = (callsite.getColumnNumber() || 0) - 1
  var src = file ? get(file) : ''
  var line = src.split('\n')[lineno].slice(col)
  var m = line.match(/assert\((.*)\)/)
  return m && m[1].trim().replace(/\n/g, ' ')
}

/**
 * Load contents of `script`.
 *
 * @param {String} script
 * @return {String}
 * @api private
 */

function get(script: string): string {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', script, false)
  xhr.send(null)
  return xhr.responseText
}

/**
 * Error with `msg`, `actual` and `expected`.
 *
 * @param {String} msg
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @return {Error}
 */

interface AssertError extends Error {
  showDiff?: boolean
  actual?: unknown
  expected?: unknown
}

function error(msg: string, actual?: unknown, expected?: unknown): AssertError {
  var err: AssertError = new Error(msg)
  err.showDiff = 3 == arguments.length
  err.actual = actual
  err.expected = expected
  return err
}

/**
 * Return the stack.
 */

function stack(): NodeJS.CallSite[] {
  var orig = Error.prepareStackTrace
  Error.prepareStackTrace = function(_, stack) {
    return stack
  }
  var err = new Error()
  Error.captureStackTrace(err)
  var stack = err.stack
  Error.prepareStackTrace = orig
  return (stack as unknown) as NodeJS.CallSite[]
}
