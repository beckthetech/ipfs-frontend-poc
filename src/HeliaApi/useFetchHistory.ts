import { useLocalStorage } from '@vueuse/core'

export const useFetchHistory = (max = 10) => {
  const history = useLocalStorage<string[]>('galafilm.ipfspoc.fetchhistory', [])
  const set = new Set<string>(history.value)
  const hasFetched = (cid: string) => set.has(cid)
  const addToHistory = (cid: string) => {
    if (set.has(cid)) {
      history.value = history.value.filter((c) => c !== cid)
      history.value.push(cid)
      return
    }
    if (max && history.value.length >= max) {
      const oldest = history.value.shift()
      if (oldest !== undefined) {
        set.delete(oldest)
      }
    }
    set.add(cid)
    history.value.push(cid)
  }
  return {
    history,
    addToHistory,
    hasFetched,
  }
}
