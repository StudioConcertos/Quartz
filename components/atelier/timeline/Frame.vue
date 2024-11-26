<template>
  <div
    @click="!isSelected && (currentSlidesIndex = props.index)"
    :class="{
      'opacity-60 cursor-pointer': !isSelected,
    }"
    class="frame"
  ></div>
</template>

<style scoped lang="postcss">
.frame {
  @apply bg-light-200 aspect-video min-w-[100px];
  @apply transition-opacity transform-gpu;
}
</style>

<script setup lang="ts">
const { currentSlidesIndex } = storeToRefs(useDeckStore());

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
});

const isSelected = computed(() => currentSlidesIndex.value === props.index);
</script>
