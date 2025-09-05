import 'chart.js'

declare module 'chart.js' {
  interface Element<T, U> {
    height: number
  }
}
