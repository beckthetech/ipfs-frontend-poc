<script lang="ts" setup>
import { computed } from 'vue'
import { useHelia } from '@/HeliaApi/useHelia'

const { loading, error } = useHelia()

const status = computed(() => {
  if (loading.value == true) return 'loading'
  if (loading.value == false && error.value.length == 0) return 'ready'
  return 'error'
})
const readyMessage = computed(() => {
  if (loading.value == true) return 'Loading...'
  if (loading.value == false && error.value.length == 0) return 'Ready'
  return 'Failing'
})
</script>

<template>
  <header id="heliaStatus" :class="status">
    <div class="wrapper w-full flex items-center justify-between">
      <span
        >Helia is: <span class="font-semibold">{{ readyMessage }}</span></span
      >
      <Transition name="fade-150" mode="out-in">
        <svg
          v-if="status === 'ready'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </Transition>
    </div>
  </header>
</template>

<style scoped>
header {
  @apply p-4 rounded-md text-black text-sm;
  @apply transition-colors;
  @apply flex place-items-center;

  &.ready {
    @apply bg-green-600;
  }

  &.loading {
    @apply bg-yellow-600;
  }

  &.error {
    @apply bg-red-600;
  }
}
</style>
