declare module 'archieml' {
  export interface Options {
    comments?: boolean
  }

  export interface Data {
    [key: string]: Value
  }

  export type Value = string | Data | Array<string | Data>

  export function load<T = Data>(input: string, options?: Options): T

  export default {
    load,
  }
}
