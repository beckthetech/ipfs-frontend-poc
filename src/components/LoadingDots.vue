<template>
  <div class="dots-typing" />
</template>

<style scoped>
.dots-typing {
  --dot-color: theme('colors.teal.400');
  @apply relative w-[10px] h-[10px] left-[-9999px] rounded-full;
  background-color: var(--dot-color);
  color: var(--dot-color);
  box-shadow:
    9984px 0 0 0 var(--dot-color),
    9999px 0 0 0 var(--dot-color),
    10014px 0 0 0 var(--dot-color);
  animation: dots-typing 1.5s infinite linear;
}

@keyframes dots-typing {
  0% {
    box-shadow:
      9984px 0 0 0 var(--dot-color),
      9999px 0 0 0 var(--dot-color),
      10014px 0 0 0 var(--dot-color);
  }
  16.667% {
    box-shadow:
      9984px -10px 0 0 var(--dot-color),
      9999px 0 0 0 var(--dot-color),
      10014px 0 0 0 var(--dot-color);
  }
  33.333% {
    box-shadow:
      9984px 0 0 0 var(--dot-color),
      9999px 0 0 0 var(--dot-color),
      10014px 0 0 0 var(--dot-color);
  }
  50% {
    box-shadow:
      9984px 0 0 0 var(--dot-color),
      9999px -10px 0 0 var(--dot-color),
      10014px 0 0 0 var(--dot-color);
  }
  66.667% {
    box-shadow:
      9984px 0 0 0 var(--dot-color),
      9999px 0 0 0 var(--dot-color),
      10014px 0 0 0 var(--dot-color);
  }
  83.333% {
    box-shadow:
      9984px 0 0 0 var(--dot-color),
      9999px 0 0 0 var(--dot-color),
      10014px -10px 0 0 var(--dot-color);
  }
  100% {
    box-shadow:
      9984px 0 0 0 var(--dot-color),
      9999px 0 0 0 var(--dot-color),
      10014px 0 0 0 var(--dot-color);
  }
}
</style>
