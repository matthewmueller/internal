import { Immutable } from '../ts/type'

// types we can use
export type Store<S> = Immutable<S> & Readonly<Mixin<S>>
export type Action<S> = (state: Immutable<S>) => Partial<S>

// state mixin
type Mixin<S> = {
  subscribe: (fn: () => void) => void
  unsubscribe: (fn: () => void) => void
  setState(state: Partial<S> | Action<S>): void
  toJSON(): Immutable<S>
}

// store state and subscribe to changes
export default function Store<S>(initial: Immutable<S>): Store<S> {
  const subscribers = <Array<() => void>>[]
  return Object.assign(initial, <Mixin<S>>{
    subscribe(fn) {
      subscribers.push(fn)
    },
    unsubscribe(fn) {
      const i = subscribers.indexOf(fn)
      if (~i) subscribers.splice(i, 1)
    },
    setState(update) {
      update = typeof update === 'function' ? update(initial) : update
      Object.assign(initial, update)
      for (let i = 0; i < subscribers.length; i++) {
        subscribers[i]()
      }
    },
    toJSON() {
      const shallowCopy = Object.assign(<S & Mixin<S>>{}, initial)
      // clear out the mixin
      delete shallowCopy['subscribe']
      delete shallowCopy['unsubscribe']
      delete shallowCopy['setState']
      delete shallowCopy['toJSON']
      return shallowCopy
    },
  })
}
