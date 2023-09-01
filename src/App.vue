<script lang="ts" setup>
// import { ref, inject, computed  } from 'vue';
import TextFetcher from './components/TextFetcher.vue'
import HeliaStatus from './components/HeliaStatus.vue'
// import UnixFSManager from './components/UnixFSManager.vue';
</script>

<template>
  <HeliaStatus />

  <main class="flex-grow">
    <TextFetcher />
    <!-- <UnixFSManager /> -->
  </main>
</template>

<style scoped></style>
