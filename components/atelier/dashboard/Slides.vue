<template>
  <NuxtLink class="slides" target="_blank" :to="`/atelier/${props.id}`">
    <p class="mb-2">{{ props.title }}</p>
    <p class="italic opacity-60">Last modified: {{ props.created_at }}</p>
    <div class="whitespace"></div>
    <div class="w-full aspect-video bg-light-200 border-rd mb-2"></div>
  </NuxtLink>
</template>

<style scoped lang="postcss">
.slides {
  @apply block w-sm aspect-video;
  @apply bg-dark-500 p-6;
  @apply border-rd border-solid border-2;
  @apply border-dark-200;
}
</style>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
});
</script>
