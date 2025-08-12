<template>
  <div
    @click="!isSelected && (currentSlidesIndex = props.index)"
    :class="{
      'opacity-60 cursor-pointer': !isSelected,
    }"
    class="frame"
  >
    <AtelierRenderSnapshot
      :deck="currentSlides.deck"
      :slides="slides[props.index].id"
    />
    <div class="overlay">
      <div
        v-if="isSelected"
        @click="console.log('menu clicked')"
        class="i-carbon-overflow-menu-horizontal menu"
      ></div>
      <p class="indicator">
        {{ props.index + 1 }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.frame {
  @apply bg-light-200 aspect-video min-w-[100px];
  @apply transition-opacity transform-gpu border-rd;

  .overlay {
    @apply text-dark-900;

    .menu {
      @apply absolute top-2 right-3;
      @apply text-5 3xl:text-5.5 cursor-pointer;
      @apply opacity-0 transition-opacity;
    }

    .indicator {
      @apply absolute bottom-2 left-3;
      @apply text-3 3xl:text-3.5 transition-opacity;
    }
  }

  &:hover {
    .menu {
      @apply opacity-100;
    }
  }
}
</style>

<script setup lang="ts">
const { slides, currentSlides, currentSlidesIndex } = storeToRefs(
  useDeckStore()
);

const props = defineProps<{
  index: number;
}>();

const isSelected = computed(() => currentSlidesIndex.value === props.index);
</script>
