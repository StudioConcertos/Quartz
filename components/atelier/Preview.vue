<template>
  <div class="preview">
    <div class="slides"></div>
    <div class="whitespace"></div>
    <div class="flex flex-row">
      <button
        :class="{ disabled: useSlidesStore().selectedPage === 0 }"
        @click="useSlidesStore().selectedPage--"
      >
        <div class="i-carbon-arrow-left"></div>
      </button>
      <p class="mx-6">
        {{ useSlidesStore().selectedPage + 1 }} / {{ props.pages.length }}
      </p>
      <button
        :class="{
          disabled: useSlidesStore().selectedPage + 1 === props.pages.length,
        }"
        @click="useSlidesStore().selectedPage++"
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
const props = defineProps({
  pages: {
    type: [Object],
    required: true,
  },
});
</script>
