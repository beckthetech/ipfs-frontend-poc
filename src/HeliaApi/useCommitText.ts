/* eslint-disable no-console */

import { ref } from 'vue'
import { CID } from 'multiformats/cid'
// import { base32 } from 'multiformats/bases/base32'
import { useHelia } from './useHelia'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useCommitText = () => {
  // const cid = CID.parse('bafkreife2klsil6kaxqhvmhgldpsvk5yutzm4i5bgjoq6fydefwtihnesa', base32.decoder)
  const cid = ref<InstanceType<typeof CID>>()
  const commitedText = ref('')
  const { loading, error, helia, fs } = useHelia()

  const commitText = async (text: string) => {
    console.log('text', text)
    if (!fs.value || !helia.value) {
      console.log('please wait for helia to start')
      return
    }
    if (error.value.length === 0 && !loading.value) {
      try {
        const res = await fs.value.addBytes(
          encoder.encode(text),
          // @ts-ignore type mismatch between AddOptions and Blocks
          helia.value.blockstore
        )
        cid.value = res
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }

  const fetchCommitedText = async () => {
    let text = ''
    console.log(cid)
    if (!fs.value) {
      console.log('please wait for helia to start')
      return
    }
    if (!cid.value) {
      console.log('please commit text first')
      return
    }
    if (error.value.length === 0 && !loading.value) {
      try {
        for await (const chunk of fs.value.cat(cid.value)) {
          text += decoder.decode(chunk, {
            stream: true,
          })
        }
        commitedText.value = text
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }

  return { cid, commitText, commitedText, fetchCommitedText }
}
