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
    @apply absolute invisible;
    @apply text-sm font-normal text-center;
    @apply bg-dark-200 border-rd;
    @apply p-2 mt-8;
  }
}

.tooltip:hover span {
  @apply visible;
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
