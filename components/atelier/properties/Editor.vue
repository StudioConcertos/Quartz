<template>
  <textarea
    v-if="useSlidesStore().selectedNode"
    wrap="hard"
    class="editor"
    @contextmenu.prevent
  />
  <div v-else class="placeholder" @contextmenu.prevent>
    <div class="i-carbon-error"></div>
    <p>Select a node</p>
  </div>
</template>

<style scoped lang="postcss">
.editor,
.placeholder {
  @apply w-full h-full;
  @apply border-rd border-0;
  @apply bg-dark-800 text-light-200;
}

.editor {
  @apply p-[2.5ch] resize-none;
}

.placeholder {
  @apply flex justify-center items-center;
  @apply select-none;

  [class*="i-"] {
    @apply text-4xl mr-4;
  }
}
</style>
