/* eslint-disable no-console */

import { unixfs, type UnixFS } from '@helia/unixfs'
import { createHelia, type Helia } from 'helia'
import { ref, type Plugin } from 'vue'

export const HeliaProviderPlugin: Plugin = {
  install: async (app) => {
    const loading = ref(true)
    const error = ref('')
    const helia = ref<Helia>()
    const fs = ref<UnixFS>()
    app.provide('HeliaProvider', {
      loading,
      error,
      helia,
      fs,
    })
    try {
      const instance = await createHelia()
      loading.value = false
      helia.value = instance
      fs.value = unixfs(instance)
    } catch (err) {
      const e = err as Error
      console.error(e)
      error.value = e.toString()
      loading.value = false
    }
  },
}
