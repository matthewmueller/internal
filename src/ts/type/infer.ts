const IS_UNION = Symbol('is_union')
const IS_OPTIONAL = Symbol('is_optional')
const IS_NULLABLE = Symbol('is_nullable')
const IS_ANY = Symbol('is_any')
const IS_UNKNOWN = Symbol('is_unknown')
const IS_NEVER = Symbol('is_never')

type Nullable<T> = {
  [IS_NULLABLE]: true
  type: T
}

type Optional<T> = {
  [IS_OPTIONAL]: true
  type: T
}

type Union<T extends any[]> = {
  [IS_UNION]: true
  types: T
}

type Any = {
  [IS_ANY]: true
}

type Unknown = {
  [IS_UNKNOWN]: true
}

type Never = {
  [IS_NEVER]: true
}

export type SchemaPrimitives = string | number | boolean | bigint | undefined | null | symbol

type SchemaTypeConstructors =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor
  | DateConstructor
  | ObjectConstructor
  | FunctionConstructor
  | MapConstructor
  | SetConstructor
  | WeakMapConstructor
  | WeakSetConstructor
  | ArrayBufferConstructor
  | DataViewConstructor
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor

export type Schema =
  | {
      [key: string | number]: SchemaPrimitives | SchemaTypeConstructors | Schema | Schema[]
    }
  | SchemaPrimitives
  | SchemaTypeConstructors
  | Schema[]

type OptionalKeys<T> = {
  [K in keyof T]: T[K] extends Optional<any> ? K : T[K] extends Never ? K : never
}[keyof T]

type NonOptional<T> = Exclude<keyof T, OptionalKeys<T>>

export type SchemaToInferredTypes<T> = T extends StringConstructor
  ? string
  : T extends NumberConstructor
  ? number
  : T extends BooleanConstructor
  ? boolean
  : T extends Nullable<infer U>
  ? SchemaToInferredTypes<U> | null | undefined | void
  : T extends Optional<infer U>
  ? SchemaToInferredTypes<U>
  : T extends Union<infer U>
  ? SchemaToInferredTypes<U[number]>
  : T extends Any
  ? any
  : T extends Unknown
  ? unknown
  : T extends Never
  ? never
  : T extends Array<infer U>
  ? SchemaToInferredTypes<U>[]
  : T extends Record<string | number | symbol, any>
  ? MapSchemaTypes<T>
  : T

type MapSchemaTypes<T extends Schema> = {
  [K in NonOptional<T>]: SchemaToInferredTypes<T[K]>
} & {
  [K in OptionalKeys<T>]?: SchemaToInferredTypes<T[K]>
}

export type InferSchemaType<T extends Schema> = MapSchemaTypes<T>

export function Nullable<T>(type: T) {
  return {
    [IS_NULLABLE]: true,
    type,
  } as Nullable<T>
}

export function Optional<T>(type: T) {
  return {
    [IS_OPTIONAL]: true,
    type,
  } as Optional<T>
}

export function Union<T extends any[]>(...types: T) {
  return {
    [IS_UNION]: true,
    types,
  } as Union<T>
}

export const Any: Any = {
  [IS_ANY]: true,
}

var schema = {
  author: String,
  tags: [Union(String, Number)],
  age: Optional(Number),
  age2: Optional(Number),
  another: {
    cool: Optional(Number),
    nice: [String],
  },
}

console.log(schema)

// type Schema<T> = {
//   [K in keyof T]: T[K] extends { type: StringConstructor }
//   ? string
//   : unknown
// }

type State = InferSchemaType<typeof schema>

const state: State = {
  author: '',
  tags: [10, 'cool'],
  another: {
    nice: ['ok'],
  },
}
