// Like Readonly but recursive
// Source: https://github.com/krzkaczor/ts-essentials
type Primitive = string | number | boolean | bigint | symbol | undefined | null
type Builtin = Primitive | Function | Date | Error | RegExp
type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? Map<DeepReadonly<K>, DeepReadonly<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends Set<infer U>
  ? Set<DeepReadonly<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepReadonly<U>>
  : T extends Promise<infer U>
  ? Promise<DeepReadonly<U>>
  : T extends {}
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : Readonly<T>

// types we can use
export type Store<S> = DeepReadonly<S> & Readonly<Mixin<S>>
export type Action<S> = (state: DeepReadonly<S>) => Partial<S>

// state mixin
type Mixin<S> = {
  subscribe: (fn: () => void) => void
  unsubscribe: (fn: () => void) => void
  setState(state: Partial<S> | Action<S>): void
  toJSON(): DeepReadonly<S>
}

// store state and subscribe to changes
export default function Store<S>(initial: DeepReadonly<S>): Store<S> {
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
