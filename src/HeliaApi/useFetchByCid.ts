/* eslint-disable no-console */
import { ref } from 'vue'
import { CID } from 'multiformats/cid'
import { type UnixFSStats } from '@helia/unixfs'
import { useHelia } from './useHelia'

type CIDType = InstanceType<typeof CID>

const decoder = new TextDecoder()

export const useFetchByCid = () => {
  const cid = ref<CIDType>()
  const fileStats = ref<Omit<UnixFSStats, 'cid'>>()
  const commitedText = ref('')
  const fetching = ref(false)
  const fetchError = ref('')
  const { loading, error, fs } = useHelia()

  const getStats = async (cid: CIDType, debug = true) => {
    if (!fs.value || error.value.length || loading.value) {
      return;
    }
    const stats = await fs.value.stat(cid, {
      onProgress: debug ? (event) => {
        console.log(event.type, event.detail)
      } : undefined,
    })
    const { cid: _fileCid, ...rest } = stats
    fileStats.value = rest
  }

  const getTextContents = async (cid: CIDType, debug = true) => {
    if (!fs.value || error.value.length || loading.value) {
      return;
    }
    let text = ''
    for await (const chunk of fs.value.cat(cid, {
      onProgress: debug ? (event) => {
        console.log(event.type, event.detail)
      } : undefined,
    })) {
      text += decoder.decode(chunk, {
        stream: true,
      })
    }
    commitedText.value = text
  }

  const fetchByCid = async (cidString: string) => {
    fetchError.value = ''
    if (!fs.value || error.value.length || loading.value) {
      fetchError.value = 'please wait for helia to start'
      console.log('please wait for helia to start')
      return
    }
    cid.value = CID.parse(cidString)
    if (!cid.value) {
      fetchError.value = 'invalid cid'
      return
    }
    console.log(cid.value)
    fetching.value = true
    try {
      await Promise.all([
        getStats(cid.value),
        getTextContents(cid.value),
      ])
      fetching.value = false
    } catch (err) {
      console.error(err)
      fetchError.value = (err as Error).message
      fetching.value = false
    }
  }

  return { cid, commitedText, fileStats, fetchByCid, fetching, error: fetchError }
}
