<script lang="ts" setup>
import { computed } from 'vue'
import { type UnixFSStats } from '@helia/unixfs'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

type BigIntKeys = 'fileSize' | 'dagSize' | 'localFileSize' | 'localDagSize'
type PickKeys = 'mode' | 'mtime' | 'blocks' | 'type' | 'unixfs'

type DisplayStats = { cid?: string } & Partial<Pick<UnixFSStats, PickKeys>> &
  Partial<Record<BigIntKeys, string>>

const props = defineProps<{
  text: string
  cid?: string
  stats?: Omit<UnixFSStats, 'cid'>
}>()

const displayStats = computed(() => {
  const data: DisplayStats = {
    cid: props.cid,
  }
  if (props.stats) {
    ;['dagSize', 'fileSize', 'localDagSize', 'localFileSize'].forEach((key) => {
      const k = key as BigIntKeys
      if (props.stats![k]) {
        data[k] = props.stats![k]?.toString()
      }
    })

    data.blocks = props.stats.blocks
    data.mode = props.stats.mode
    data.mtime = props.stats.mtime
    data.type = props.stats.type
    data.unixfs = props.stats.unixfs
  }
  return data
})
</script>

<template>
  <div v-if="text">
    <p class="title">Contents</p>
    <div class="bg-white dark:bg-black rounded-md p-8">
      <p id="fetchedtextOutput">{{ text }}</p>
    </div>
    <template v-if="cid">
      <p class="title mt-8">Stats</p>
      <div class="cid-container bg-white dark:bg-black rounded-md text-sm overflow-hidden">
        <div class="overflow-auto p-8 font-mono whitespace-pre">
          <pre>{{ displayStats }}</pre>
        </div>
      </div>
      <div class="px-8 mt-8 flex gap-8">
        <a
          :href="`https://explore.ipld.io/#/explore/${cid?.toString()}`"
          target="_blank"
          class="ext-link"
        >
          IPLD Explorer
          <ArrowTopRightOnSquareIcon class="h-4" />
        </a>
        <a :href="`https://cid.contact/cid/${cid?.toString()}`" target="_blank" class="ext-link">
          CID Contact
          <ArrowTopRightOnSquareIcon class="h-4" />
        </a>
      </div>
    </template>
  </div>
</template>

<style scoped>
.title {
  @apply px-8 mb-4 font-semibold text-sm;
}

.ext-link {
  @apply flex items-center gap-2 font-semibold text-sm;
}

.cid-container {
  .overflow-auto {
    scrollbar-color: theme('colors.neutral.500') theme('colors.white');
    &::-webkit-scrollbar {
      &-track {
        @apply bg-white dark:bg-black;
      }
      &-thumb {
        @apply border-white dark:border-black;
      }
    }
  }
  @media (prefers-color-scheme: dark) {
    .overflow-auto {
      scrollbar-color: theme('colors.neutral.500') theme('colors.black');
    }
  }
}
</style>
