<template>
  <div class="render">
    <AtelierRenderElement
      v-if="!isEmptyTree(currentTree)"
      v-for="node in currentTree.children"
      :key="node.id"
      :node="node"
    />
    <div v-else class="loader">
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.render {
  @apply w-full border-rd aspect-video;
  @apply bg-light-200 text-dark-900;
  @apply relative overflow-hidden;

  .root {
    @apply w-full h-full;
  }

  .loader {
    @apply flex justify-center items-center h-full;
  }
}
</style>

<script setup lang="ts">
const { currentTree } = storeToRefs(useDeckStore());
</script>
