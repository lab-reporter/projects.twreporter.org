import { createQuery } from '@tanstack/svelte-query'
import { fetchCSV } from '../fetch'
import { dataPath } from '../constants/path'

export const useChartFootnotes = () =>
  createQuery({
    queryKey: ['footnotes'],
    queryFn: async () => {
      return await fetchCSV({
        url: dataPath.chartFootnotes,
        key: 'Type',
      })
    },
    retry: true,
  })
