/* eslint-disable no-console */
import { type DirectoryCandidate } from 'ipfs-unixfs-importer'
import { type UnixFSEntry } from 'ipfs-unixfs-exporter'
import { CID } from 'multiformats/cid'
import { useHelia } from './useHelia'

export type CIDType = InstanceType<typeof CID>

type ReturnType<T> = Promise<
  | {
      status: 'success'
      data: T
    }
  | undefined
>

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useUnixFS = () => {
  const { loading, error, fs } = useHelia()

  const getStat = async (
    dirCid: CIDType,
    path: string
  ): ReturnType<{
    cid: CIDType
    blocks: number
  }> => {
    if (!fs.value || error.value.length || loading.value) {
      console.log('please wait for helia to start')
      return
    }
    try {
      const res = await fs.value.stat(dirCid, {
        path,
      })
      const data = { cid: res.cid, blocks: res.blocks }
      return { status: 'success', data }
    } catch (e) {
      console.error(e)
    }
  }

  const addDirectory = async (path: Partial<DirectoryCandidate>): ReturnType<CIDType> => {
    if (!fs.value || error.value.length || loading.value) {
      console.log('please wait for helia to start')
      return
    }
    try {
      const emptyDirCid = await fs.value.addDirectory(path)
      const res = await fs.value.mkdir(emptyDirCid, path.path ?? '')
      return { status: 'success', data: res }
    } catch (e) {
      console.error(e)
    }
  }

  const getDirectory = async (dirCid: CIDType, path?: string): ReturnType<UnixFSEntry[]> => {
    if (!fs.value || error.value.length || loading.value) {
      console.log('please wait for helia to start')
      return
    }
    const output = []
    try {
      if (typeof path !== 'undefined') {
        const opts = path ? { path } : undefined
        for await (const entry of fs.value.ls(dirCid, opts)) {
          output.push(entry)
        }
      } else {
        for await (const entry of fs.value.ls(dirCid)) {
          output.push(entry)
        }
      }
      return { status: 'success', data: output }
    } catch (e) {
      console.error(e)
    }
  }

  const addFile = async (
    name: string,
    dirCid: CIDType,
    content: string
  ): ReturnType<{
    dirCid: CIDType
    fileCid: CIDType
  }> => {
    if (!fs.value || error.value.length || loading.value) {
      console.log('please wait for helia to start')
      return
    }

    try {
      const res = await fs.value.addFile({
        content: encoder.encode(content),
      })
      const updatedCid = await fs.value.cp(res, dirCid, name)
      return { status: 'success', data: { dirCid: updatedCid, fileCid: res } }
    } catch (e) {
      console.error(e)
    }
  }

  const getFile = async (cid: CIDType): ReturnType<string> => {
    if (!fs.value || error.value.length || loading.value) {
      console.log('please wait for helia to start')
      return
    }
    let txt = ''
    try {
      for await (const buf of fs.value.cat(cid)) {
        txt += decoder.decode(buf, {
          stream: true,
        })
      }
      return { status: 'success', data: txt }
    } catch (e) {
      console.error(e)
    }
  }
  return {
    getStat,
    addDirectory,
    getDirectory,
    addFile,
    getFile,
  }
}
