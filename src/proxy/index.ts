// imports
import raf from '../internal/raf'

// exports
export default proxy

// Proxy type
export type Proxy<State> = State & {
  subscribe(fn: () => void): void
  unsubscribe(fn: () => void): void
}

// proxy function
function proxy<State extends Object>(target: State): Proxy<State> {
  if (typeof Proxy === 'undefined') {
    throw new Error('proxy: requires ES6 proxies to work properly')
  }
  const fns: Array<() => void> = []
  let dirty = false
  // debounce the trigger
  function debounce() {
    dirty = true
    raf(trigger)
  }
  // trigger the subscribers
  function trigger() {
    if (!dirty) {
      return
    }
    for (let i = 0; i < fns.length; i++) {
      fns[i]()
    }
    dirty = false
  }
  // attach subscribe and unsubscribe to the top-level proxy
  return Object.assign(proxy2(target, debounce), {
    subscribe(fn: () => void) {
      fns.push(fn)
    },
    unsubscribe(fn: () => void) {
      const i = fns.indexOf(fn)
      if (~i) fns.splice(i, 1)
    },
  })
}

// recursive and responsible for the proxying
function proxy2<State extends Object>(state: State, trigger: () => void): State {
  return new Proxy(state, {
    set: function(target, property, value) {
      // @ts-ignore
      target[property] = value
      trigger()
      return true
    },
    get: function(target, property) {
      // @ts-ignore
      const value = target[property]
      if (typeof value === 'object') {
        return proxy2(value, trigger)
      }
      return value
    },
  })
}
