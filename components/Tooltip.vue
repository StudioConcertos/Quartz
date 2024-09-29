<template>
  <div class="tooltip">
    <slot />
    <span :style="{ 'margin-left': `-${width / 2 - 4}px` }" ref="el">
      {{ props.description }}
    </span>
  </div>
</template>

<style scoped lang="postcss">
.tooltip {
  span {
    @apply absolute opacity-0 invisible;
    @apply text-sm font-normal text-center;
    @apply bg-dark-200 border-rd;
    @apply p-2 mt-8 transition-opacity;
  }
}

.tooltip:hover span {
  @apply opacity-100 visible;
}
</style>

<script setup lang="ts">
const props = defineProps({
  description: {
    type: String,
    required: true,
  },
});

const el = ref<HTMLSpanElement>();
const width = useElementSize(el).width;
</script>
