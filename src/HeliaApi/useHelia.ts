import { type UnixFS } from '@helia/unixfs'
import { type Helia } from 'helia'
import { inject, ref, type Ref } from 'vue'

export interface HeliaProvider {
  loading: Ref<boolean>
  error: Ref<string>
  helia: Ref<Helia | undefined>
  fs: Ref<UnixFS | undefined>
}

export const useHelia = () =>
  inject<HeliaProvider>('HeliaProvider', {
    loading: ref(false),
    error: ref(''),
    helia: ref<Helia>(),
    fs: ref<UnixFS>(),
  })
