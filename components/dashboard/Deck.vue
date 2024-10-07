<template>
  <NuxtLink
    class="deck"
    target="_blank"
    :to="`/atelier/${props.id}`"
    @contextmenu.prevent="
      useContextMenu().open($event, [
        {
          label: 'Delete',
          action: () => {},
        },
      ])
    "
  >
    <p class="mb-2">{{ props.title }}</p>
    <p class="opacity-60">
      {{ new Date(props.last_modified).toLocaleString() }}
    </p>
    <div class="whitespace"></div>
    <div class="preview"></div>
  </NuxtLink>
</template>

<style scoped lang="postcss">
.deck {
  @apply block w-sm aspect-video;
  @apply bg-dark-500 p-6 transition;
  @apply border-rd border-solid border-1;
  @apply border-dark-200 hover-border-light-200;

  .preview {
    @apply w-full aspect-video bg-light-200 border-rd mb-2;
  }
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
  last_modified: {
    type: String,
    required: true,
  },
});
</script>
