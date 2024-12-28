<template>
  <div v-if="url" class="snapshot">
    <NuxtImg
      :src="url"
      :alt="`snapshot of ${props.deck}`"
      loading="lazy"
      class="snapshot"
    />
  </div>
</template>

<style scoped lang="postcss">
.snapshot {
  @apply relative w-full aspect-video;

  img {
    @apply absolute inset-0;
  }
}
</style>

<script setup lang="ts">
const { fetchSlides } = useDeckStore();

const props = defineProps<{
  deck: string;
  slides?: string;
}>();

const url = asyncComputed(async () => {
  return await useSnapshot().fetch(
    props.deck,
    props.slides ?? (await fetchSlides(props.deck, 0)).id
  );
});
</script>
