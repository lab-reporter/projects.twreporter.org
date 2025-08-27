import { createQuery } from '@tanstack/svelte-query'
import { fetchCSV } from '../fetch'
import { dataPath } from '../constants/path'

export const useChartData = (area: string) =>
  createQuery({
    queryKey: ['chart', area],
    queryFn: async () => {
      const res = await fetchCSV({ url: dataPath.chart, key: 'Area' })
      return res?.[area]
    },
    retry: true,
  })
