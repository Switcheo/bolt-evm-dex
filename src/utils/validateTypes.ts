export function hasProperty<T, K extends string | symbol | number>(obj: unknown, prop: K): obj is T {
  return typeof obj === "object" && obj !== null && prop in obj;
}
