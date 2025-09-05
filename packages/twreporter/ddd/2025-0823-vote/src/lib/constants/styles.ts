export const styleOptions = {
  width: 600,
  height: 750,
  getScale: (innerWidth: number) => {
    return innerWidth < 730 ? innerWidth / 600 : 730 / 600
  },
}
