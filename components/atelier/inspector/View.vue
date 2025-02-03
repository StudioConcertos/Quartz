<template>
  <div v-if="selectedNode" class="view" @contextmenu.prevent>
    <Component
      v-for="component in nodeComponents"
      :key="component.type"
      :is="resolvedComponents[component.type]"
      :component="component"
    />
  </div>
  <div v-else class="placeholder" @contextmenu.prevent>
    <div class="i-carbon-error"></div>
    <p>No node selected</p>
  </div>
</template>

<style scoped lang="postcss">
.view,
.placeholder {
  @apply w-full h-full;
  @apply border-rd border-0;
  @apply bg-dark-800 text-light-200;
}

.view {
  @apply overflow-y-auto;

  &::-webkit-scrollbar {
    @apply hidden;
  }
}

.placeholder {
  @apply flex flex-col justify-center items-center text-4;

  [class*="i-"] {
    @apply text-10 mb-6;
  }
}
</style>

<script setup lang="ts">
const { currentTree, selectedNode, currentComponents } = storeToRefs(
  useDeckStore()
);

// https://github.com/nuxt/nuxt/issues/14036
const resolvedComponents = {
  animation: resolveComponent("LazyNodeComponentAnimation"),
  base: resolveComponent("LazyNodeComponentBase"),
  camera: resolveComponent("LazyNodeComponentCamera"),
  mesh: resolveComponent("LazyNodeComponentMesh"),
  scene: resolveComponent("LazyNodeComponentScene"),
  transform: resolveComponent("LazyNodeComponentTransform"),
  typography: resolveComponent("LazyNodeComponentTypography"),
};

const nodeComponents = computed<ComponentModel[]>(() => {
  if (!selectedNode.value?.id || !currentTree.value) return [];

  return searchNodeComponents(selectedNode.value.id);
});

function searchNodeComponents(node: string): ComponentModel[] {
  return currentComponents.value.filter((component) => component.node === node);
}
</script>
