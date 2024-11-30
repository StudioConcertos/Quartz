<template>
  <div class="render">
    <AtelierRenderElement
      v-for="node in currentTree.children"
      :key="node.id"
      :node="node"
    />
  </div>
</template>

<style scoped lang="postcss">
.render {
  @apply w-full border-rd aspect-video;
  @apply bg-light-200 text-dark-900;
}
</style>

<script setup lang="ts">
const { currentTree } = storeToRefs(useDeckStore());
</script>
