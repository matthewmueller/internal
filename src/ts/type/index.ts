// Source: https://github.com/krzkaczor/ts-essentials

type Primitive = string | number | boolean | bigint | symbol | undefined | null
type Builtin = Primitive | Function | Date | Error | RegExp

// Like Readonly but recursive
export type Immutable<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? Map<Immutable<K>, Immutable<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<Immutable<K>, Immutable<V>>
  : T extends Set<infer U>
  ? Set<Immutable<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<Immutable<U>>
  : T extends Promise<infer U>
  ? Promise<Immutable<U>>
  : T extends {}
  ? { readonly [K in keyof T]: Immutable<T[K]> }
  : Readonly<T>

// Support a JSON type
// https://github.com/microsoft/TypeScript/issues/1897#issuecomment-338650717
export type Json = boolean | number | string | null | JsonArray | JsonMap
interface JsonMap {
  [key: string]: Json
}
interface JsonArray extends Array<Json> {}
