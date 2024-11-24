<template>
  <div class="render">
    <AtelierRenderElement
      v-for="node in tree.children"
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
const { tree } = storeToRefs(useDeckStore());
</script>
