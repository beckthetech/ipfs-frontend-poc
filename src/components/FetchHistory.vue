<script lang="ts" setup>
import { computed } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ClockIcon } from '@heroicons/vue/24/outline'
import { useFetchHistory } from '@/HeliaApi/useFetchHistory'

const emit = defineEmits<{
  selected: [string]
}>()

const { history } = useFetchHistory()
const historyReverse = computed(() => history.value.slice().reverse())
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="btn">
        <span class="sr-only">Show history</span>
        <ClockIcon class="h-6" />
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="dropdown">
        <MenuItem v-for="item in historyReverse" :key="item" as="div" v-slot="{ active }">
          <button
            class="menu-item"
            :class="active ? 'text-teal-500' : ''"
            @click="emit('selected', item)"
            type="button"
          >
            {{ item }}
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<style scoped>
.btn {
  @apply transition flex items-center rounded-full text-teal-600 hover:text-teal-500;
  @apply focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-600;
}

.dropdown {
  @apply absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md p-4 text-sm overflow-hidden;
  @apply bg-white dark:bg-black shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-900 ring-opacity-10 focus:outline-none;
}

.menu-item {
  @apply font-mono py-2 transition-colors w-full text-ellipsis whitespace-nowrap overflow-hidden block;
}
</style>
