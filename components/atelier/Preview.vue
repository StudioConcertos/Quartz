<template>
  <div class="preview">
    <div class="slides"></div>
    <div class="whitespace"></div>
    <div class="flex flex-row">
      <button
        :class="{ disabled: useDeckStore().selectedSlidesIndex === 0 }"
        @click="useDeckStore().selectedSlidesIndex--"
      >
        <div class="i-carbon-arrow-left"></div>
      </button>
      <p class="mx-6">
        {{ useDeckStore().selectedSlidesIndex + 1 }} /
        {{ useDeckStore().slides.length }}
      </p>
      <button
        :class="{
          disabled:
            useDeckStore().selectedSlidesIndex + 1 ===
            useDeckStore().slides.length,
        }"
        @click="useDeckStore().selectedSlidesIndex++"
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
