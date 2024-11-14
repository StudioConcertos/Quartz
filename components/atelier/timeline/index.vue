<template>
  <div class="timeline">
    <AtelierTimelineFrame v-for="i in useDeckStore().slides.length" :key="i" />
    <button><p>+</p></button>
  </div>
</template>

<style scoped lang="postcss">
.timeline {
  @apply flex flex-1 overflow-x-auto;
  @apply bg-dark-800 w-full px-10 py-8;
  @apply border-solid border-0 border-t-2 border-dark-200;

  .frame:not(:last-child) {
    @apply mr-8;
  }

  button {
    @apply aspect-video opacity-60 transition-opacity;
    @apply border-1 border-rd border-solid b-light-200;
    @apply flex items-center justify-center;

    p {
      @apply text-4xl font-100;
    }

    &:hover {
      @apply opacity-100;
    }
  }
}
</style>

<script setup lang="ts"></script>
