// imports
import raf from '../internal/raf'

// exports
export default proxy

// proxy function
function proxy<T extends Object>(target: T, fn?: () => void): T {
  if (typeof Proxy === 'undefined') {
    throw new Error('proxy: requires ES6 proxies to work properly')
  }
  const func = fn || (() => {})
  let dirty = false
  function trigger() {
    if (dirty) {
      func()
    }
    dirty = false
  }
  return new Proxy(target, {
    set: function(_target, property, value) {
      // @ts-ignore
      target[property] = value
      dirty = true
      raf(trigger)
      return true
    },
    get: function(target, property) {
      // @ts-ignore
      const value = target[property]
      if (typeof value === 'object') {
        return proxy(value, fn)
      }
      return value
    },
  })
}
