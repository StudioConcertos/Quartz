<template>
  <div v-if="selectedNode" class="view" @contextmenu.prevent>
    <Component
      v-for="component in components"
      :key="component.type"
      :is="resolvedComponents[component.type]"
      :data="component.data"
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
}

.placeholder {
  @apply flex flex-col justify-center items-center text-4;

  [class*="i-"] {
    @apply text-10 mb-6;
  }
}
</style>

<script setup lang="ts">
const { tree, selectedNode } = storeToRefs(useDeckStore());

// TODO: Refactor this.
const resolvedComponents = {
  animation: resolveComponent("NodeComponentAnimation"),
  base: resolveComponent("NodeComponentBase"),
  text: resolveComponent("NodeComponentText"),
  transform: resolveComponent("NodeComponentTransform"),
};

const components = computed<ComponentModel[]>(() => {
  if (!selectedNode.value?.id) return [];

  // @ts-expect-error
  return searchNodeComponents(tree.value, selectedNode.value.id);
});

function searchNodeComponents(tree: Tree, id: string): ComponentModel[] {
  if (tree.id === id) return tree.components;

  for (const child of tree.children || []) {
    const components = searchNodeComponents(child, id);

    if (components.length) return components;
  }

  return [];
}
</script>
