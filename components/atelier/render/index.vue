<template>
  <div class="render">
    <AtelierRenderElement
      v-if="!isEmptyTree(currentTree)"
      v-for="node in currentTree.children"
      :key="node.id"
      :node="node"
    />
    <div v-else>Loading...</div>
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
}
</style>

<script setup lang="ts">
const { currentTree } = storeToRefs(useDeckStore());
</script>
