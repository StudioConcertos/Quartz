<template>
  <div class="toolbar">
    <NuxtLink to="/atelier">
      <div class="i-carbon-workspace"></div>
    </NuxtLink>
    <p>Unnamed Slides</p>
    <NuxtLink to="/atelier">
      <div class="i-carbon-play"></div>
    </NuxtLink>
  </div>
</template>

<style scoped lang="postcss">
.toolbar {
  @apply flex justify-between items-center;
  @apply bg-dark-500 w-full h-20;
  @apply border-solid border-0 border-b-2 border-dark-200;

  a {
    @apply h-full px-6 flex items-center transition-colors;
    @apply hover:bg-light-200 hover:text-dark-500;

    [class*="i-"] {
      @apply text-2xl;
    }
  }
}
</style>

<script setup lang="ts"></script>
