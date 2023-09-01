<script lang="ts" setup>
import { ref, watch } from 'vue'
import LoadingDots from '@/components/LoadingDots.vue'
import FetchedItem from '@/components/FetchedItem.vue'
import FetchHistory from '@/components/FetchHistory.vue'
import { useFetchByCid } from '@/HeliaApi/useFetchByCid'
import { useFetchHistory } from '@/HeliaApi/useFetchHistory'

const { cid, commitedText, fileStats, fetchByCid, fetching, error } = useFetchByCid()
const { addToHistory } = useFetchHistory()
const cidString = ref()
const validationMessage = ref('')
const submitted = ref(false)

const validate = (cid: string) => {
  if (!cid) {
    return 'Please enter a CID'
  }
  return ''
}

const doFetch = async () => {
  submitted.value = true
  validationMessage.value = validate(cidString.value)
  if (validationMessage.value) {
    return
  }
  try {
    addToHistory(cidString.value)
    await fetchByCid(cidString.value)
  } catch (err) {
    validationMessage.value = (err as Error)?.message
    console.error(err)
  }
}

const handleFetchText = async (e: Event) => {
  e.preventDefault()
  await doFetch()
}

const handleSelected = (cid: string) => {
  if (cidString.value === cid) return
  cidString.value = cid
  doFetch()
}

watch(
  cidString,
  (current) => {
    if (current && validationMessage.value) {
      validationMessage.value = ''
    }
  },
  { immediate: true }
)

watch(
  error,
  (current) => {
    if (current) {
      validationMessage.value = current
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="h-full items-center">
    <div class="flex flex-col items-center justify-start py-16">
      <h1 class="text-center font-bold text-3xl sm:text-5xl">Lookup by CID</h1>
      <form
        class="mt-8 w-full max-w-md flex flex-col sm:flex-row sm:items-center"
        @submit="handleFetchText"
      >
        <div class="w-full flex gap-4 items-center">
          <input
            v-model="cidString"
            aria-label="CID"
            type="text"
            name="cid"
            id="fetchText"
            placeholder="Enter CID"
            class="input"
            autocomplete="off"
          />
          <!-- <FetchHistory class="sm:hidden" @selected="handleSelected" /> -->
        </div>
        <div class="flex items-center mt-3 sm:mt-0 sm:ml-3">
          <button id="fetchTextButton" type="submit" class="btn" :disabled="fetching || undefined">
            {{ fetching ? 'Looking...' : 'Lookup' }}
          </button>
          <FetchHistory class="ml-3" @selected="handleSelected" />
        </div>
      </form>
      <Transition name="fade-150">
        <div class="relative w-full max-w-md mt-3">
          <div class="absolute w-full text-xs px-1 text-red-500">{{ validationMessage }}</div>
        </div>
      </Transition>
    </div>
    <div class="flex flex-col items-center justify-start">
      <LoadingDots v-if="fetching" />
      <template v-else>
        <Transition appear name="fade-150">
          <FetchedItem
            :text="commitedText"
            :cid="cid?.toString()"
            :stats="fileStats"
            class="w-full max-w-2xl"
          />
        </Transition>
      </template>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply transition block text-sm leading-6 w-full rounded-md border-0 p-3 bg-white text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-600;
  @apply dark:bg-black dark:text-neutral-100 dark:ring-neutral-600 dark:placeholder:text-neutral-500;
}
.btn {
  @apply transition text-sm leading-6 inline-flex w-full items-center justify-center rounded-md bg-teal-600 py-3 px-6 font-semibold text-white shadow-sm;
  @apply sm:w-32 sm:flex-grow-0 sm:flex-shrink-0;
  @apply hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600;
  @apply disabled:hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50;
}
</style>
