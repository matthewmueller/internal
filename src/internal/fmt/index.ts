/**
 * toString.
 */

const toString =
  typeof window !== 'undefined' && window.JSON ? JSON.stringify : String

/**
 * Fmt type
 */

type Fmt = {
  (str: string, ...args: any[]): string
  [k: string]: (arg: any) => string
}

/**
 * Export `fmt`
 */

export default (fmt as unknown) as Fmt

/**
 * Formatters
 */

fmt.o = toString
fmt.s = String
fmt.d = parseInt

/**
 * Format the given `str`.
 *
 * @param {String} str
 * @param {...} args
 * @return {String}
 * @api public
 */

function fmt(str: string, ...args: any[]): string {
  var j = 0
  return str.replace(/%([a-z])/gi, function(_, f: string) {
    // @ts-ignore
    return fmt[f] ? fmt[f](args[j++]) : _ + f
  })
}
