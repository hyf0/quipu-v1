export const nonNullable = <T>(
  value: T | null | undefined,
): value is NonNullable<typeof value> => value != null

export const hasProp2 = <Object, Prop extends keyof Object>(
  object: Object,
  prop: Prop,
): object is Extract<Object, Record<Prop, any>> => prop in object

export const hasProp = <Prop extends string>(prop: Prop) =>
  <Object>(obj: Object): obj is Extract<Object, Record<Prop, any>> => prop in obj
