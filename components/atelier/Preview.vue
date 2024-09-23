<template>
  <div class="preview">
    <div class="slides"></div>
    <div class="whitespace"></div>
    <div class="flex flex-row">
      <button
        :class="{ disabled: currentSlidesIndex === 0 }"
        @click="deckStore.prevSlides()"
      >
        <div class="i-carbon-arrow-left"></div>
      </button>
      <p class="mx-6">
        {{ currentSlidesIndex + 1 }} /
        {{ slides.length }}
      </p>
      <button
        :class="{
          disabled: currentSlidesIndex + 1 === slides.length,
        }"
        @click="deckStore.nextSlides()"
      >
        <div class="i-carbon-arrow-right"></div>
      </button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.preview {
  @apply flex flex-1 flex-col px-40 justify-center items-center;

  .slides {
    @apply bg-light-200 w-full border-rd aspect-video;
  }

  button {
    [class*="i-"] {
      @apply text-xl;
    }
  }
}
</style>

<script setup lang="ts">
const deckStore = useDeckStore();
const { slides, currentSlidesIndex } = storeToRefs(useDeckStore());
</script>
