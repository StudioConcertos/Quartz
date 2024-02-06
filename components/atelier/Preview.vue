<template>
  <div class="preview">
    <div class="slides"></div>
    <div class="whitespace"></div>
    <div class="flex flex-row">
      <button>
        <div class="i-carbon-arrow-left"></div>
      </button>
      <p class="mx-6">1 / 1</p>
      <button>
        <div class="i-carbon-arrow-right"></div>
      </button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.preview {
  @apply flex flex-1 flex-col justify-center items-center;

  .slides {
    @apply bg-light-200 w-4xl h-lg border-rd;
  }

  button {
    [class*="i-"] {
      @apply text-xl;
    }
  }
}
</style>

<script setup lang="ts"></script>
